import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(useremail: string, userpass: string) {
    const user = await this.usersService.findByEmail(useremail);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(userpass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { id: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
