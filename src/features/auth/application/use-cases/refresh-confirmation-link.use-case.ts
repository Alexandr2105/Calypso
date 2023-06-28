import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersService } from '../../../users/application/users.service';
import { randomUUID } from 'crypto';

//TODO:вот это надо обсудить

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
    private usersService: UsersService,
  ) {}
  async execute(command: RefreshConfirmationLinkCommand): Promise<void> {
    const user = await this.usersRepo.getUserByEmail(command.email);

    // if (!user || user.emailConfirmation.isConfirmed)
    //   throw new BadRequestException(createErrorMessage('email'));
    if (user) {
      const refreshConfirmationCode =
        await this.usersService.refreshConfirmationInfo(user.id);

      await this.emailService.sendEmailConfirmationLink(
        command.email,
        refreshConfirmationCode,
      );
    } else {
      await this.emailService.sendEmailConfirmationLink(
        command.email,
        randomUUID(),
      );
    }
  }
}
