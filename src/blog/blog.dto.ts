import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectIdOrHexString } from 'src/decorators/is_object_id.decorator';

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObjectIdOrHexString()
  author: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  min_read: number;

  @ApiProperty()
  @IsOptional()
  is_published: boolean;
}

export class UpdateBlogDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsObjectIdOrHexString()
  author: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  min_read: number;

  @ApiProperty()
  @IsOptional()
  is_published: boolean;
}

export class FindBlogDto {
  @ApiProperty()
  @IsOptional()
  @IsObjectIdOrHexString()
  _id: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;
}

export class BlogIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObjectIdOrHexString()
  id: Types.ObjectId;
}

export class GetAllBlogsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pagination: number;
}