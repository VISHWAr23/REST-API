import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { RestThrottlerGuard } from '../common/guards/rest-throttler.guard';

@Controller('auth')
@UseGuards(RestThrottlerGuard)
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
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}