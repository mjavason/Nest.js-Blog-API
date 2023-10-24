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
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'; // Import Swagger decorators
import { MESSAGES } from 'src/constants';
import { SuccessResponse } from 'src/helpers/response.helper';
import { IBlog } from './blog.interface';
import { ResponseDto } from 'src/dto';
import { ResponseData } from 'src/interfaces/response.interface';
import {
  CreateBlogDto,
  FindBlogDto,
  BlogIdDto,
  UpdateBlogDto,
  GetAllBlogsDto,
} from './blog.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('blog')
@ApiTags('Blog')
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
export class BlogController {
  constructor(private readonly service: BlogService) {}

  // Create a new blog
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new blog' }) // Add an API operation summary
  @ApiBody({ type: CreateBlogDto }) // Specify the request body DTO
  async create(@Body() body: CreateBlogDto): Promise<object> {
    console.log(Req);

    const data = await this.service.create(body);

    if (!data) throw new InternalServerErrorException();

    return SuccessResponse(data);
  }

  // Get a list of all blogs with optional pagination
  @Get()
  @ApiOperation({ summary: 'Get a list of all blogs with optional pagination' })
  async getAllDefault(): Promise<ResponseData<IBlog[]>> {
    const data = await this.service.getAll(0);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  // Find blogs based on search criteria
  @Get('search')
  @ApiOperation({ summary: 'Find blogs based on search criteria' })
  @ApiQuery({ type: FindBlogDto }) // Define the query parameters
  async find(@Query() query: FindBlogDto): Promise<ResponseData<IBlog[]>> {
    const data = await this.service.find(query);

    if (!data) throw new InternalServerErrorException();
    if (data.length === 0) throw new NotFoundException();

    return SuccessResponse(data);
  }

  // Check if blogs exist based on search criteria
  @Get('exists')
  @ApiOperation({ summary: 'Check if blogs exist based on search criteria' })
  @ApiQuery({ type: FindBlogDto }) // Define the query parameters
  async exists(@Query() query: FindBlogDto): Promise<object> {
    const data = await this.service.exists(query);

    // If nothing exists, return 'false'
    if (!data) return SuccessResponse(false);

    return SuccessResponse(data);
  }

  // Get the count of blogs based on search criteria
  @Get('count')
  @ApiOperation({ summary: 'Get the count of blogs based on search criteria' })
  @ApiQuery({ type: FindBlogDto }) // Define the query parameters
  async getCount(@Query() query: FindBlogDto): Promise<object> {
    const data = await this.service.getCount(query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(0);

    return SuccessResponse(data);
  }

  // Get a list of all blogs with optional pagination
  @Get(':pagination')
  @ApiOperation({ summary: 'Get a list of all blogs with optional pagination' }) // Define the URL parameter
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
  @Patch(':id/:name')
  @ApiOperation({ summary: 'Update an existing blog' })
  @ApiBody({ type: UpdateBlogDto }) // Specify the request body DTO
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
  @ApiOperation({ summary: 'Soft delete a blog' })
  async delete(@Param() param: BlogIdDto): Promise<object> {
    const { id } = param;

    const data = await this.service.softDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }

  // Hard delete a blog (for admins only)
  @Delete(':id/hard')
  @ApiOperation({ summary: 'Hard delete a blog (for admins only)' })
  async hardDelete(@Param() param: BlogIdDto): Promise<object> {
    const { id } = param;

    const data = await this.service.hardDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }
}
