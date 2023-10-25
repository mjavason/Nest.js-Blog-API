import {
  Controller,
  UseGuards,
  Post,
  Request,
  InternalServerErrorException,
  ForbiddenException,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { hashPassword } from 'src/helpers/password.helper';
import { SuccessResponse } from 'src/helpers/response.helper';
import { CreateUserDto } from 'src/user/user.dto';
import { ResponseData } from 'src/interfaces/response.interface';
import { IUser } from 'src/user/user.interface';
import { LoginUserDto } from './auth.dto';
import { JWT_SECRET, MESSAGES } from 'src/constants';
import { signJwt } from 'src/utils/jwt';
import { MailTemplateService } from 'src/mail/mail_templates.service';
import { ResponseDto } from 'src/dto';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: HttpStatus.OK,
  type: ResponseDto,
  description: 'Successful response with data',
})
@ApiInternalServerErrorResponse({ description: MESSAGES.INTERNAL_ERROR })
@ApiBadRequestResponse({ description: MESSAGES.BAD_PARAMETERS })
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailTemplateService: MailTemplateService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  async login(@Request() req) {
    return await this.authService.login(req);
  }

  @Post('/register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: CreateUserDto })
  @ApiConflictResponse({ description: 'User already exists' })
  async register(@Body() body: CreateUserDto): Promise<ResponseData<IUser>> {
    const existing_user = await this.userService.findOne({
      email: body.email,
    });

    // Hash password
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
    const token = await signJwt({ _id: data._id }, JWT_SECRET, '1h');

    const sendMail = await this.mailTemplateService.sendWelcomeMail(
      body.email,
      body.first_name,
      body.last_name,
      token,
    );

    if (!sendMail) {
      return SuccessResponse(
        data,
        'User registered successfully. Welcome mail failed',
      );
    }

    return SuccessResponse({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
    });
  }
}
