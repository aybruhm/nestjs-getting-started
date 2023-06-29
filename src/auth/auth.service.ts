import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private users_repo: UsersRepository,
  ) {}

  async signUp(payload: AuthCredentialsDto): Promise<object> {
    const user = await this.users_repo.createUser(payload);
    return { message: `User ${user} created successfully!` };
  }

  async signIn(payload: AuthCredentialsDto): Promise<object> {
    const { username, password } = payload;
    const user = await this.users_repo.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return { message: 'Login successful!' };
    } else {
      throw new UnauthorizedException('Please check your login credentials!');
    }
  }
}
