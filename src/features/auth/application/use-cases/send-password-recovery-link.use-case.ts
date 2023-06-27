import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersService } from '../../../users/application/users.service';
import { BadRequestException } from '@nestjs/common';
import { createErrorMessage } from '../../../../common/helpers/create-error-message';

export class SendPasswordRecoveryLinkCommand {
  constructor(public email: string) {}
}

@CommandHandler(SendPasswordRecoveryLinkCommand)
export class SendPasswordRecoveryLinkUseCase
  implements ICommandHandler<SendPasswordRecoveryLinkCommand>
{
  constructor(
    private emailService: EmailAdapter,
    private usersRepo: UsersRepository,
    private usersService: UsersService,
  ) {}
  async execute(command: SendPasswordRecoveryLinkCommand): Promise<void> {
    const user = await this.usersRepo.getUserByEmail(command.email);

    if (!user || !user.emailConfirmation.isConfirmed)
      throw new BadRequestException(createErrorMessage('email'));

    const refreshConfirmationCode =
      await this.usersService.refreshConfirmationInfo(user.id);

    await this.emailService.sendEmailPasswordRecoveryLink(
      command.email,
      refreshConfirmationCode,
    );
  }
}
