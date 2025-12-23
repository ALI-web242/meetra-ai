import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('guest_sessions')
@Index('idx_guest_session_meeting_id', ['meetingId'])
@Index('idx_guest_session_expires_at', ['expiresAt'])
export class GuestSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  meetingId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
