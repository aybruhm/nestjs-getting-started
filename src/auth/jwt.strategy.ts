import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './users.repository';
import { JWTPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private users_repo: UsersRepository,
  ) {
    super({
      secretOrKey: 'jwt-secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.users_repo.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
