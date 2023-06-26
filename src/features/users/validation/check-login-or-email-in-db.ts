import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class CheckLoginOrEmailInDb implements ValidatorConstraintInterface {
  constructor(private readonly usersRepo: UsersRepository) {}
  async validate(loginOrEmail: string) {
    const user = await this.usersRepo.getUserByLoginOrEmail(loginOrEmail);
    return !user;
  }

  defaultMessage(): string {
    return 'Не верные данные';
  }
}

// export function CheckDuplicateLoginOrEmail(
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: CheckLoginOrEmailInDb,
//     });
//   };
// }

// @ValidatorConstraint({ name: '', async: true })
// @Injectable()
// export class CheckOriginalEmail implements ValidatorConstraintInterface {
//   constructor(private readonly usersRepository: IUsersRepository) {}
//
//   async validate(email: string): Promise<boolean> {
//     const user = await this.usersRepository.findLoginOrEmail(email);
//     return user === undefined || user === null;
//   }
//
//   defaultMessage(): string {
//     return 'Не верные данные';
//   }
// }
