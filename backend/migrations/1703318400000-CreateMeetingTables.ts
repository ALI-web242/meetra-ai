import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMeetingTables1703318400000 implements MigrationInterface {
  name = 'CreateMeetingTables1703318400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create meeting_status enum
    await queryRunner.query(`
      CREATE TYPE "meeting_status_enum" AS ENUM ('waiting', 'active', 'ended')
    `);

    // Create participant_role enum
    await queryRunner.query(`
      CREATE TYPE "participant_role_enum" AS ENUM ('host', 'participant')
    `);

    // Create meetings table
    await queryRunner.query(`
      CREATE TABLE "meetings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "meetingId" character varying(12) NOT NULL,
        "name" character varying(255) NOT NULL DEFAULT 'Meeting',
        "passwordHash" character varying(255),
        "hostId" uuid NOT NULL,
        "status" "meeting_status_enum" NOT NULL DEFAULT 'waiting',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "startedAt" TIMESTAMP WITH TIME ZONE,
        "endedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "UQ_meetings_meetingId" UNIQUE ("meetingId"),
        CONSTRAINT "PK_meetings" PRIMARY KEY ("id")
      )
    `);

    // Create meeting_participants table
    await queryRunner.query(`
      CREATE TABLE "meeting_participants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "meetingId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "role" "participant_role_enum" NOT NULL DEFAULT 'participant',
        "joinedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "leftAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_meeting_participants" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key for meetings.hostId -> users.id
    await queryRunner.query(`
      ALTER TABLE "meetings"
      ADD CONSTRAINT "FK_meetings_hostId"
      FOREIGN KEY ("hostId") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Add foreign key for meeting_participants.meetingId -> meetings.id
    await queryRunner.query(`
      ALTER TABLE "meeting_participants"
      ADD CONSTRAINT "FK_meeting_participants_meetingId"
      FOREIGN KEY ("meetingId") REFERENCES "meetings"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Add foreign key for meeting_participants.userId -> users.id
    await queryRunner.query(`
      ALTER TABLE "meeting_participants"
      ADD CONSTRAINT "FK_meeting_participants_userId"
      FOREIGN KEY ("userId") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "idx_meeting_meeting_id" ON "meetings" ("meetingId")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_meeting_host_id" ON "meetings" ("hostId")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_meeting_status" ON "meetings" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_participant_meeting_id" ON "meeting_participants" ("meetingId")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_participant_user_id" ON "meeting_participants" ("userId")
    `);

    // Create unique constraint for participant (one user per meeting at a time)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_participant_meeting_user"
      ON "meeting_participants" ("meetingId", "userId")
      WHERE "leftAt" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "idx_participant_meeting_user"`);
    await queryRunner.query(`DROP INDEX "idx_participant_user_id"`);
    await queryRunner.query(`DROP INDEX "idx_participant_meeting_id"`);
    await queryRunner.query(`DROP INDEX "idx_meeting_status"`);
    await queryRunner.query(`DROP INDEX "idx_meeting_host_id"`);
    await queryRunner.query(`DROP INDEX "idx_meeting_meeting_id"`);

    // Drop foreign keys
    await queryRunner.query(`
      ALTER TABLE "meeting_participants" DROP CONSTRAINT "FK_meeting_participants_userId"
    `);
    await queryRunner.query(`
      ALTER TABLE "meeting_participants" DROP CONSTRAINT "FK_meeting_participants_meetingId"
    `);
    await queryRunner.query(`
      ALTER TABLE "meetings" DROP CONSTRAINT "FK_meetings_hostId"
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE "meeting_participants"`);
    await queryRunner.query(`DROP TABLE "meetings"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "participant_role_enum"`);
    await queryRunner.query(`DROP TYPE "meeting_status_enum"`);
  }
}
