import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto'; 
import { Request, Response } from 'express';
import { console } from 'inspector';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthDto, @Req() req: Request, @Res() res: Response) {
    return this.authService.login(dto, req, res);
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    await this.authService.sendWelcomeEmail(user.email);
    return user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const verificationCode = await this.authService.generateVerificationCode();
    await this.authService.saveVerificationCode(dto.email, verificationCode);
    await this.authService.sendVerificationEmail(dto.email, verificationCode);
    return { message: 'Verification code sent to your email', code: verificationCode};
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.verificationCode, dto.newPassword);
  }
}