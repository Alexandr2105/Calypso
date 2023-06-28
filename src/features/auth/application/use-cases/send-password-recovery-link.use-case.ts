import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersService } from '../../../users/application/users.service';
import { randomUUID } from 'crypto';

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

    //TODO:вот это надо обсудить

    // if (!user || !user.emailConfirmation.isConfirmed)
    //   throw new BadRequestException(createErrorMessage('email'));
    if (user) {
      const refreshConfirmationCode =
        await this.usersService.refreshConfirmationInfo(user.id);

      await this.emailService.sendEmailPasswordRecoveryLink(
        command.email,
        refreshConfirmationCode,
      );
    } else {
      await this.emailService.sendEmailPasswordRecoveryLink(
        command.email,
        randomUUID(),
      );
    }
  }
}
