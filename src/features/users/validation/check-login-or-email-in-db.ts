import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class CheckLoginOrEmailInDb implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepository) {}
  async validate(loginOrEmail: string, args: ValidationArguments) {
    return this.usersRepo.getUserByLoginOrEmail(loginOrEmail).then((user) => {
      return !!user;
    });
  }
}

export function CheckDuplicateLoginOrEmail(
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CheckLoginOrEmailInDb,
    });
  };
}
