import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from '../email/email.module';
import { PasswordReset } from '../password-reset/password-reset.entity'; // Adicione a entidade

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordReset]), EmailModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
