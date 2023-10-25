import { InjectModel } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.model';

@ValidatorConstraint({ async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async validate(value: CreateUserDto) {
    const user = await this.userModel.findOne({ email: value.email });
    return !user;
  }

  defaultMessage() {
    return `This email address already exists`;
  }
}

export function IsUniqueEmail(option?: ValidationOptions) {
  return (obj: object, property_name: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName: property_name,
      options: option,
      constraints: [],
      validator: IsUniqueEmailConstraint,
      async: true,
    });
  };
}
