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
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MESSAGES } from 'src/constants';
import { SuccessResponse } from 'src/helpers/response.helper';
import { IUser } from './user.interface';
import { ResponseData } from 'src/dto';
import {
  CreateUserDto,
  FindUserDto,
  UserIdDto,
  UpdateUserDto,
  GetAllUsersDto,
} from './user.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  // Create a new user
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDto): Promise<object> {
    // body.organizer = .locals.user._id;
    const data = await this.service.create(body);

    if (!data) throw new InternalServerErrorException();

    return SuccessResponse(data);
  }

  // Get a list of all users with optional pagination
  @Get()
  async getAllDefault(): Promise<ResponseData<IUser[]>> {
    const data = await this.service.getAll(0);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  // Find users based on search criteria
  @Get('search')
  async find(@Query() query: FindUserDto): Promise<ResponseData<IUser[]>> {
    const data = await this.service.find(query);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  // Check if users exist based on search criteria
  @Get('exists')
  async exists(@Query() query: FindUserDto): Promise<object> {
    const data = await this.service.exists(query);

    // If nothing exists, return 'false'
    if (!data) return SuccessResponse(false);

    return SuccessResponse(data);
  }

  // Get the count of users based on search criteria
  @Get('count')
  async getCount(@Query() query: FindUserDto): Promise<object> {
    const data = await this.service.getCount(query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(0);

    return SuccessResponse(data);
  }

  // Get a list of all users with optional pagination
  @Get(':pagination')
  async getAll(@Param() param: GetAllUsersDto): Promise<object> {
    let { pagination } = param;
    if (!pagination) pagination = 1;

    pagination = (pagination - 1) * 10;

    const data = await this.service.getAll(pagination);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  // Update an existing user
  @Patch(':id')
  async update(
    @Param() param: UserIdDto,
    @Body() body: UpdateUserDto,
  ): Promise<object> {
    const { id } = param;

    const data = await this.service.update({ _id: id }, body);

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.UPDATED);
  }

  // Soft delete a user
  @Delete(':id')
  async delete(@Param() param: UserIdDto): Promise<object> {
    const { id } = param;

    const data = await this.service.softDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }

  // Hard delete a user (for admins only)
  @Delete(':id/hard')
  async hardDelete(@Param() param: UserIdDto): Promise<object> {
    const { id } = param;

    const data = await this.service.hardDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }
}
