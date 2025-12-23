import { useState, useCallback, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export interface RTCConfig {
  iceServers: RTCIceServer[];
}

const defaultRTCConfig: RTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export type ConnectionState = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';

export function useWebRTC(meetingId: string, userId: string) {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('new');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializePeerConnection = useCallback((config: RTCConfig = defaultRTCConfig) => {
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('webrtc:ice-candidate', {
          meetingId,
          from: userId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState as ConnectionState;
      setConnectionState(state);

      if (state === 'disconnected' || state === 'failed') {
        handleReconnect();
      } else if (state === 'connected') {
        setReconnectAttempts(0);
        setIsReconnecting(false);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', pc.iceConnectionState);

      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        handleReconnect();
      }
    };

    pcRef.current = pc;
    setPeerConnection(pc);

    return pc;
  }, [meetingId, userId]);

  const connectSocket = useCallback(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/webrtc`, {
      auth: { userId },
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebRTC signaling server');
      newSocket.emit('webrtc:join-room', { meetingId, userId });
    });

    newSocket.on('webrtc:offer', async ({ from, offer }) => {
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      newSocket.emit('webrtc:answer', {
        meetingId,
        from: userId,
        to: from,
        answer: pcRef.current.localDescription,
      });
    });

    newSocket.on('webrtc:answer', async ({ from, answer }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    newSocket.on('webrtc:ice-candidate', async ({ from, candidate }) => {
      if (!pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    newSocket.on('webrtc:user-joined', ({ userId: newUserId }) => {
      console.log('User joined:', newUserId);
    });

    newSocket.on('webrtc:user-left', ({ userId: leftUserId }) => {
      console.log('User left:', leftUserId);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return newSocket;
  }, [meetingId, userId]);

  const addLocalStream = useCallback((stream: MediaStream) => {
    if (!pcRef.current) return;

    stream.getTracks().forEach((track) => {
      pcRef.current?.addTrack(track, stream);
    });
  }, []);

  const createOffer = useCallback(async (targetUserId: string) => {
    if (!pcRef.current || !socketRef.current) return;

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socketRef.current.emit('webrtc:offer', {
      meetingId,
      from: userId,
      to: targetUserId,
      offer: pcRef.current.localDescription,
    });
  }, [meetingId, userId]);

  const handleReconnect = useCallback(() => {
    if (isReconnecting || reconnectAttempts >= 5) {
      console.log('Max reconnection attempts reached or already reconnecting');
      return;
    }

    setIsReconnecting(true);
    setReconnectAttempts((prev) => prev + 1);

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Reconnecting... Attempt ${reconnectAttempts + 1}`);

      if (pcRef.current) {
        pcRef.current.restartIce();
      }

      setIsReconnecting(false);
    }, 2000);
  }, [isReconnecting, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
      setPeerConnection(null);
    }

    if (socketRef.current) {
      socketRef.current.emit('webrtc:leave-room', { meetingId, userId });
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }

    setRemoteStream(null);
    setConnectionState('closed');
    setReconnectAttempts(0);
    setIsReconnecting(false);
  }, [meetingId, userId]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    peerConnection,
    connectionState,
    remoteStream,
    socket,
    reconnectAttempts,
    isReconnecting,
    initializePeerConnection,
    connectSocket,
    addLocalStream,
    createOffer,
    disconnect,
  };
}
