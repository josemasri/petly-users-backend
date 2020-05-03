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
    description: 'Email or username already exist',
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
  async refresh(@Headers('Authorization') bearerToken: string) {
    return await this.authService.refreshToken(bearerToken);
  }
}
