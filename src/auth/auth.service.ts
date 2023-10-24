import {
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
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
    const user = await this.UserService.findOne({
      email: email,
    });

    if (!user) throw new NotFoundException('User does not exist');

    try {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) throw new ForbiddenException('Invalid password');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    if (!user)
      throw new ForbiddenException('User email or password is incorrect');

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
