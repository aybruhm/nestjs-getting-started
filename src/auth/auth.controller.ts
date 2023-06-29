import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth_service: AuthService) {}

  @Post('signup')
  async createNewUser(@Body() payload: AuthCredentialsDto): Promise<object> {
    const user = await this.auth_service.signUp(payload);
    return user;
  }

  @Post('signin')
  async loginUser(@Body() payload: AuthCredentialsDto): Promise<object> {
    const success = await this.auth_service.signIn(payload);
    return success;
  }
}
