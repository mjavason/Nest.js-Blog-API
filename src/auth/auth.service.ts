import {
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    console.log('authservice validate user');

    const user = await this.UserService.findOne({
      email: email,
    });

    try {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) throw new ForbiddenException('Invalid password');
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!user)
      throw new ForbiddenException('User email or password is incorrect');

    return user;
  }

  async login(user: any) {
    console.log('authservice login');

    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };

    // return user;
  }
}
