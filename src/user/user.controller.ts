import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Query,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger'; // Import Swagger decorators
import { MESSAGES } from 'src/constants';
import { SuccessResponse } from 'src/helpers/response.helper';
import { IUser } from './user.interface';
import { ResponseData } from 'src/interfaces/response.interface';
import {
  CreateUserDto,
  FindUserDto,
  UserIdDto,
  UpdateUserDto,
  GetAllUsersDto,
} from './user.dto';
import { ResponseDto } from 'src/dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('jwt')
@ApiResponse({
  status: HttpStatus.OK,
  type: ResponseDto,
  description: 'Successful response with data',
})
@ApiInternalServerErrorResponse({ description: MESSAGES.INTERNAL_ERROR })
@ApiBadRequestResponse({ description: MESSAGES.BAD_PARAMETERS })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('profile')
  @ApiForbiddenResponse({ description: 'No user logged in' })
  @ApiOperation({ summary: 'Get logged in users profile' })
  async getProfile(@Request() req): Promise<ResponseData<IUser>> {
    // console.log(req)
    const { user } = req;

    if (!user) throw new ForbiddenException('No user logged in');

    return SuccessResponse(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: MESSAGES.CREATED })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() body: CreateUserDto): Promise<ResponseData<IUser>> {
    const data = await this.service.create(body);

    if (!data) throw new InternalServerErrorException();

    return SuccessResponse(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get the latest 10 users' })
  async getAllDefault(): Promise<ResponseData<IUser[]>> {
    const data = await this.service.getAll(0);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  @Get('search')
  @ApiNotFoundResponse({ description: MESSAGES.NOT_FOUND })
  @ApiOperation({ summary: 'Find users based on search criteria' })
  @ApiQuery({
    type: FindUserDto,
  })
  async find(@Query() query: FindUserDto): Promise<ResponseData<IUser[]>> {
    const data = await this.service.find(query);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  @Get('exists')
  @ApiOperation({ summary: 'Check if users exist based on search criteria' })
  @ApiQuery({ type: FindUserDto })
  async exists(@Query() query: FindUserDto): Promise<ResponseData<[]>> {
    const data = await this.service.exists(query);

    if (!data) return SuccessResponse([]);

    return SuccessResponse(data);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Get the count of users based on search criteria',
  })
  @ApiQuery({ type: FindUserDto })
  async getCount(@Query() query: FindUserDto): Promise<ResponseData<number>> {
    const data = await this.service.getCount(query);

    if (!data) return SuccessResponse(0);

    return SuccessResponse(data);
  }

  @Get(':pagination')
  @ApiOperation({ summary: 'Get a list of all users with optional pagination' })
  @ApiNotFoundResponse({ description: MESSAGES.NOT_FOUND })
  async getAll(@Param() param: GetAllUsersDto): Promise<object> {
    let { pagination } = param;
    if (!pagination) pagination = 1;

    pagination = (pagination - 1) * 10;

    const data = await this.service.getAll(pagination);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiNotFoundResponse({ description: MESSAGES.NOT_FOUND })
  @ApiBody({ type: UpdateUserDto, description: 'Updated user data' })
  async update(
    @Param() param: UserIdDto,
    @Body() body: UpdateUserDto,
  ): Promise<object> {
    const { id } = param;
    const data = await this.service.update({ _id: id }, body);

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.UPDATED);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiNotFoundResponse({ description: MESSAGES.NOT_FOUND })
  async delete(@Param() param: UserIdDto): Promise<object> {
    const { id } = param;

    const data = await this.service.softDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Hard delete a user (for admins only)' })
  @ApiNotFoundResponse({ description: MESSAGES.NOT_FOUND })
  async hardDelete(@Param() param: UserIdDto): Promise<object> {
    const { id } = param;

    const data = await this.service.hardDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }
}
