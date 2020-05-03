import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';
import { Token } from './token.entity';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger('Auth');

  async signUp(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; expiresIn: number; unit: string }> {
    const user = await this.userRepository.signUp(registerDto);
    const accessToken = await this.createJwt(user);
    return { accessToken, expiresIn: 3600, unit: 'seconds' };
  }

  async signIn(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; expiresIn: number; unit: string }> {
    const user = await this.userRepository.validateUserPassword(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.createJwt(user);
    return { accessToken, expiresIn: 3600, unit: 'seconds' };
  }

  async refreshToken(bearerToken: string) {
    const jwt = bearerToken.split(' ')[1];
    const decodedJwt = this.jwtService.decode(jwt);
    const payload = { username: decodedJwt['usernme'] };
    const newJwt = this.jwtService.sign(payload, { expiresIn: 3600 });
    const res = await Token.update({ jwt }, { jwt: newJwt });
    if (res.raw.affectedRows === 0) {
      throw new UnauthorizedException('Invalid Token');
    }
    return { accessToken: newJwt, expiresIn: 3600, unit: 'seconds' };
  }

  validateToken(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  getUserFromToken(token: string): User {
    const payload = this.jwtService.decode(token);
    const user = new User();
    user.id = payload['id'];
    user.email = payload['email'];
    user.username = payload['username'];
    user.createdAt = payload['createdAt'];
    return user;
  }

  // ==============================
  //  Generate and save JWT on db
  // ==============================
  private async createJwt(user: User): Promise<string> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: 3600 });
    const token = new Token();
    token.jwt = accessToken;
    await token.save();
    return accessToken;
  }
}
