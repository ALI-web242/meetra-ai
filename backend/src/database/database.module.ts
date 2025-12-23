import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // Prefer DATABASE_URL (e.g., from Neon) if provided, otherwise fall back to discrete settings
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: true,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: false,
            connectTimeoutMS: 10000,
            extra: {
              max: 10,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 10000,
            },
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Scan for entities
          synchronize: true, // Use synchronize for development, migrations for production
          logging: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}