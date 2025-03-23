import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomInt } from 'crypto';
import { PasswordReset } from '../password-reset/password-reset.entity';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(useremail: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: useremail },
    });
  }

  async sendPasswordResetCode(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const code = randomInt(10000, 99999).toString(); // Gera código de 5 dígitos
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Código expira em 15 minutos

    const passwordReset = this.passwordResetRepository.create({
      email,
      code,
      expiresAt,
    });
    await this.passwordResetRepository.save(passwordReset);

    const subject = 'Código de recuperação de senha';
    const text = `Seu código de recuperação de senha é: ${code}. Este código expira em 15 minutos.`;

    await this.emailService.sendEmail(email, subject, text);
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { email, code },
    });

    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      throw new NotFoundException('Código inválido ou expirado');
    }

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    await this.passwordResetRepository.remove(passwordReset);
  }
}
