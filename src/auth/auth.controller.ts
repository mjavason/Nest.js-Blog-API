import {
  Controller,
  UseGuards,
  Post,
  Request,
  InternalServerErrorException,
  ForbiddenException,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { hashPassword } from 'src/helpers/password.helper';
import { SuccessResponse } from 'src/helpers/response.helper';
import { CreateUserDto } from 'src/user/user.dto';
import { ResponseData } from 'src/dto';
import { IUser } from 'src/user/user.interface';
import { LoginUserDto } from './auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: LoginUserDto) {
    console.log('Inside auth controller login route');

    return await this.authService.login(req);
  }

  @Post('/register')
  async register(@Body() body: CreateUserDto): Promise<ResponseData<IUser>> {
    // const cwd = process.cwd();
    // console.log('Current working directory:', cwd);

    let existing_user = await this.userService.findOne({
      email: body.email,
    });

    //Hash password
    try {
      const hashedPassword = await hashPassword(body.password);
      body.password = hashedPassword;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    if (existing_user) throw new ForbiddenException('User already exists');
    const data = await this.userService.create(body);

    if (!data) throw new InternalServerErrorException();

    // Send mail confirmation email
    // let token = await signJwt({ _id: data._id }, JWT_SECRET, '1h');

    // let sendMail = await mailController.sendWelcomeMail(
    //   body.email,
    //   body.first_name,
    //   body.last_name,
    //   token,
    // );

    // if (!sendMail)
    //   return SuccessResponse(
    //     res,
    //     data,
    //     'User registered successfully. Welcome mail failed',
    //   );

    return SuccessResponse({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
    });
  }
}
