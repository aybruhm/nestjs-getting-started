import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private users_repo: UsersRepository,
    private jwt_service: JwtService,
  ) {}

  async signUp(payload: AuthCredentialsDto): Promise<object> {
    const user = await this.users_repo.createUser(payload);
    return { message: `User ${user} created successfully!` };
  }

  async signIn(payload: AuthCredentialsDto): Promise<object> {
    const { username, password } = payload;
    const user = await this.users_repo.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const jwtPayload: JWTPayload = { username };
      const accessToken: string = this.jwt_service.sign(jwtPayload);
      return { message: 'Login successful!', data: { token: accessToken } };
    } else {
      throw new UnauthorizedException('Please check your login credentials!');
    }
  }
}
