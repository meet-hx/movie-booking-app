import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDtoRequest, SignInDtoResponse } from './dto/sign-in.dto';
import type { Response } from 'express';
import { CreateUserDtoRequest } from '../user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
    type: SignInDtoResponse,
  })
  async signIn(
    @Body() signInDto: SignInDtoRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInDtoResponse> {
    const userSignin = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    res.cookie('token', userSignin.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    });
    return userSignin;
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in-local')
  @ApiOperation({ summary: 'Sign in user (Local Strategy)' })
  @ApiBody({ type: SignInDtoRequest })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
    type: SignInDtoResponse,
  })
  signInLocal(
    @Request() req: { user: SignInDtoResponse },
    @Res({ passthrough: true }) res: Response,
  ): SignInDtoResponse {
    res.cookie('token', req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    });
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logged out successfully' };
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async signUp(
    @Body() signupDto: CreateUserDtoRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userSignup = await this.authService.signUp(signupDto);
    res.cookie('token', userSignup.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    });
    return userSignup;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  getProfile(@Request() req: { user: any }) {
    return req.user as Record<string, any>;
  }
}
