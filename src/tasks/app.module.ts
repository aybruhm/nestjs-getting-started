import { Module } from '@nestjs/common';
import { TasksModule } from './tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config_service: ConfigService) => {
        return {
          type: 'postgres',
          host: config_service.get('DATABASE_HOST'),
          port: parseInt(config_service.get('DATABASE_PORT')) || 3050,
          username: config_service.get('DATABASE_USERNAME'),
          password: config_service.get('DATABASE_PASSWORD'),
          database: config_service.get('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
