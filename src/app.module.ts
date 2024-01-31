import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: 'postgres',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: process.env.NODE_ENV !== 'production',
        retryAttempts: 3,
      }),
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: '127.0.0.1',
    //     port: 5555,
    //     username: 'postgres',
    //     password: 'secretpassword',
    //     database: 'postgres',
    //     entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    //     synchronize: process.env.NODE_ENV !== 'production',
    //     retryAttempts: 3,
    //   }),
    // }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
