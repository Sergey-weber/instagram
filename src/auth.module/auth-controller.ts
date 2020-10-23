import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiModelProperty, ApiResponse } from '@nestjs/swagger';
import { sessionLogin } from './okta-client';
import { Request } from 'express';

export class LoginDto {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  password: string;
}

export class LoginResponseDto {
  @ApiModelProperty()
  sessionId: string;

  @ApiModelProperty()
  userEmail: string;

  @ApiModelProperty()
  userId: string;
}

@Controller('login')
export default class AuthController {
  @Post()
  @ApiResponse({ type: LoginResponseDto, status: 201 })
  async login(@Body() data: LoginDto, @Req() request: Request): Promise<LoginResponseDto> {
    const { email, password } = data;

    try {
      const session = await sessionLogin({ email, password });

      request.res.cookie('sessionId', session.sessionId);

      return session;
    } catch(e) {
      console.log('loggin error', e);
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}