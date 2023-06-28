import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { createExpirationDateForLink } from '../../../common/helpers/create-expiration-date-for-link';
//TODO:вот это надо обсудить
@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}
  async refreshConfirmationInfo(userId: string): Promise<string> {
    const newConfirmationCode = randomUUID();

    const expDate = createExpirationDateForLink(10);

    await this.usersRepo.refreshConfirmationInfo(
      userId,
      newConfirmationCode,
      expDate,
    );

    return newConfirmationCode;
  }
}
