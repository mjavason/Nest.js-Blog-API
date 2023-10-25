import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: false })
class IsObjectIdOrHexStringConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value === 'string') {
      // Check if it's a valid ObjectId or a valid hex string
      return Types.ObjectId.isValid(value) || /^[0-9a-fA-F]{24}$/.test(value);
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid ObjectId or hex string.`;
  }
}

export function IsObjectIdOrHexString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdOrHexStringConstraint,
    });
  };
}
