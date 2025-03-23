import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PasswordReset } from './password-reset/password-reset.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, PasswordReset],
      synchronize: true,
    }),
    AuthModule,
    EmailModule,
    PasswordResetModule,
    TypeOrmModule.forFeature([PasswordReset]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
