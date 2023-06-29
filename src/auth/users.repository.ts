import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private data_source: DataSource) {
    super(User, data_source.createEntityManager());
  }

  async createUser(payload: AuthCredentialsDto): Promise<string> {
    /*--------------------------------------------------
	Responsible for creating a user to the database.
	----------------------------------------------------*/
    const { username, password } = payload;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username: username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return username;
  }
}
