import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiTags } from '@nestjs/swagger';
import { MESSAGES } from 'src/constants';
import { SuccessResponse } from 'src/helpers/response.helper';
import { IBlog } from './blog.interface';
import { ResponseData } from 'src/dto';
import {
  CreateBlogDto,
  FindBlogDto,
  BlogIdDto,
  UpdateBlogDto,
  GetAllBlogsDto,
} from './blog.dto';

@Controller('blog')
@ApiTags('Blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  // Create a new blog
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateBlogDto): Promise<object> {
    // body.organizer = .locals.blog._id;
    const data = await this.service.create(body);

    if (!data) throw new InternalServerErrorException();

    return SuccessResponse(data);
  }

  // Get a list of all blogs with optional pagination
  @Get()
  async getAllDefault(): Promise<ResponseData<IBlog[]>> {
    const data = await this.service.getAll(0);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  // Find blogs based on search criteria
  @Get('search')
  async find(@Query() query: FindBlogDto): Promise<ResponseData<IBlog[]>> {
    const data = await this.service.find(query);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  // Check if blogs exist based on search criteria
  @Get('exists')
  async exists(@Query() query: FindBlogDto): Promise<object> {
    const data = await this.service.exists(query);

    // If nothing exists, return 'false'
    if (!data) return SuccessResponse(false);

    return SuccessResponse(data);
  }

  // Get the count of blogs based on search criteria
  @Get('count')
  async getCount(@Query() query: FindBlogDto): Promise<object> {
    const data = await this.service.getCount(query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(0);

    return SuccessResponse(data);
  }

  // Get a list of all blogs with optional pagination
  @Get(':pagination')
  async getAll(@Param() param: GetAllBlogsDto): Promise<object> {
    let { pagination } = param;
    if (!pagination) pagination = 1;

    pagination = (pagination - 1) * 10;

    const data = await this.service.getAll(pagination);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  // Update an existing blog
  @Patch(':id')
  async update(
    @Param() param: BlogIdDto,
    @Body() body: UpdateBlogDto,
  ): Promise<object> {
    const { id } = param;

    const data = await this.service.update({ _id: id }, body);

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.UPDATED);
  }

  // Soft delete a blog
  @Delete(':id')
  async delete(@Param() param: BlogIdDto): Promise<object> {
    const { id } = param;

    const data = await this.service.softDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }

  // Hard delete a blog (for admins only)
  @Delete(':id/hard')
  async hardDelete(@Param() param: BlogIdDto): Promise<object> {
    const { id } = param;

    const data = await this.service.hardDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }
}
