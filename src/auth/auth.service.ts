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
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({
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

  async login(req: any) {
    // console.log('Inside auth service. login function', req.user);

    const { user } = req;

    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
