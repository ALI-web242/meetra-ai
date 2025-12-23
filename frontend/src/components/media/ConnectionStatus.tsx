'use client';

import { useWebRTCStore } from '@/stores/webrtcStore';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export default function ConnectionStatus() {
  const connectionState = useWebRTCStore((state) => state.connectionState);
  const metrics = useWebRTCStore((state) => state.metrics);
  const isReconnecting = useWebRTCStore((state) => state.isReconnecting);

  const getStatusColor = () => {
    if (isReconnecting) return 'text-yellow-500';

    switch (connectionState) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-blue-500';
      case 'disconnected':
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    if (isReconnecting) return 'Reconnecting...';

    switch (connectionState) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'failed':
        return 'Connection Failed';
      default:
        return 'Not Connected';
    }
  };

  const getStatusIcon = () => {
    if (connectionState === 'failed' || connectionState === 'disconnected') {
      return <WifiOff className="w-4 h-4" />;
    }
    if (isReconnecting) {
      return <AlertCircle className="w-4 h-4 animate-pulse" />;
    }
    return <Wifi className="w-4 h-4" />;
  };

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-900/80 rounded-lg">
      <div className={`flex items-center gap-2 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      {metrics && connectionState === 'connected' && (
        <>
          <div className="w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Latency:</span>
              <span className={metrics.latency < 150 ? 'text-green-500' : metrics.latency < 300 ? 'text-yellow-500' : 'text-red-500'}>
                {metrics.latency}ms
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Quality:</span>
              <span className={getQualityColor(metrics.quality)}>
                {metrics.quality.charAt(0).toUpperCase() + metrics.quality.slice(1)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
