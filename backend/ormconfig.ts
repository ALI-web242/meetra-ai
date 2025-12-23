import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/user/user.entity';
import { GuestSession } from './src/guest/guest-session.entity';
import { Meeting } from './src/meeting/entities/meeting.entity';
import { Participant } from './src/meeting/entities/participant.entity';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const AppDataSource = new DataSource(
  databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        ssl: true,
        entities: [User, GuestSession, Meeting, Participant],
        migrations: [__dirname + '/migrations/**/*.ts'],
        synchronize: false,
      }
    : {
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'meetra_db',
        entities: [User, GuestSession, Meeting, Participant],
        migrations: [__dirname + '/migrations/**/*.ts'],
        synchronize: false,
      },
);

export default AppDataSource;