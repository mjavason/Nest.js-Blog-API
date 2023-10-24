import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectIdOrHexString } from 'src/decorators/is_object_id.decorator';
import { PasswordStrength } from 'src/decorators/password_strength.decorator';
import { IsUniqueEmail } from 'src/decorators/unique_email.decorator';


export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['user', 'admin'])
  role: 'user' | 'admin';
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(['user', 'admin'])
  role: 'user' | 'admin';
}

export class FindUserDto {
  @ApiProperty()
  @IsOptional()
  @IsObjectIdOrHexString()
  _id: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;
}

export class UserIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObjectIdOrHexString()
  id: string;
}

export class GetAllUsersDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pagination: number;
}
