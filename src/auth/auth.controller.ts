import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() body: { email: string }) {
    await this.usersService.sendPasswordResetCode(body.email);
    return { message: 'Código de recuperação enviado por e-mail.' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; code: string; newPassword: string },
  ) {
    await this.usersService.resetPassword(
      body.email,
      body.code,
      body.newPassword,
    );

    return { message: 'Senha atualizada com sucesso!' };
  }
}
