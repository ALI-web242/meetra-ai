import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { Participant } from './participant.entity';

export enum MeetingStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  ENDED = 'ended',
}

@Entity('meetings')
@Index('idx_meeting_meeting_id', ['meetingId'])
@Index('idx_meeting_host_id', ['hostId'])
@Index('idx_meeting_status', ['status'])
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  meetingId: string; // Format: XXX-XXX-XXX

  @Column({ type: 'varchar', length: 255, default: 'Meeting' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash: string | null;

  @Column({ type: 'uuid' })
  hostId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.WAITING,
  })
  status: MeetingStatus;

  @OneToMany(() => Participant, (participant) => participant.meeting)
  participants: Participant[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  endedAt: Date | null;
}
