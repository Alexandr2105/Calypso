import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createExpirationDateForLink } from '../../../../common/helpers/create-expiration-date-for-link';
import { createErrorMessage } from '../../../../common/helpers/create-error-message';

export class RefreshConfirmationLinkCommand {
  constructor(public email: string) {}
}

@CommandHandler(RefreshConfirmationLinkCommand)
export class RefreshConfirmationLinkUseCase
  implements ICommandHandler<RefreshConfirmationLinkCommand>
{
  constructor(
    private emailService: EmailAdapter,
    private usersRepo: UsersRepository,
  ) {}
  async execute(command: RefreshConfirmationLinkCommand): Promise<void> {
    const user = await this.usersRepo.getUserByEmail(command.email);

    if (!user || user.emailConfirmation.isConfirmed)
      throw new BadRequestException(createErrorMessage('email'));

    const newConfirmationCode = randomUUID();

    const expDate = createExpirationDateForLink(10);

    await this.usersRepo.refreshConfirmationInfo(
      user.id,
      newConfirmationCode,
      expDate,
    );

    await this.emailService.sendEmailRecoveryCode(
      command.email,
      newConfirmationCode,
    );
  }
}
