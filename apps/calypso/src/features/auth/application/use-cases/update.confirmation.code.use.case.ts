import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { randomUUID } from 'crypto';
import { createExpirationDateForLink } from '../../../../common/helpers/create-expiration-date-for-link';

export class UpdateConfirmationCodeCommand {
  constructor(public userId: string) {}
}

@CommandHandler(UpdateConfirmationCodeCommand)
export class UpdateConfirmationCodeUseCase
  implements ICommandHandler<UpdateConfirmationCodeCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: UpdateConfirmationCodeCommand): Promise<any> {
    const code = randomUUID();
    const expDate = createExpirationDateForLink(3600);
    await this.usersRepository.saveEmailConfirmation({
      userId: command.userId,
      confirmationCode: code,
      expirationDate: expDate,
      isConfirmed: true,
    });
    return code;
  }
}
