import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Headers,
  HttpCode,
  Put,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiHeaders,
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import {
  AuthResSuccessDto,
  AuthResConflictDto,
  AuthResUnauthorizedDto,
} from './dto/auth-res.dto';
import { InternalErrorDto } from './dto/internal-error.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiCreatedResponse({
    description: 'User created succesfully',
    type: AuthResSuccessDto,
  })
  @ApiConflictResponse({
    description: 'Email already exist',
    type: AuthResConflictDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return await this.authService.signUp(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiConsumes(
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/json',
  )
  @ApiOkResponse({
    description: 'Succesfull Login',
    type: AuthResSuccessDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthResUnauthorizedDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }

  @Put('refresh')
  @HttpCode(200)
  @ApiHeader({
    name: 'token',
    description: 'Bearer token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @ApiOkResponse({
    description: 'Succesfull refresh',
    type: AuthResSuccessDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthResUnauthorizedDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: InternalErrorDto,
  })
  async refresh(@Headers('token') bearerToken: string) {
    return await this.authService.refreshToken(bearerToken);
  }
}
