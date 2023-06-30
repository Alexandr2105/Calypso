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
}
