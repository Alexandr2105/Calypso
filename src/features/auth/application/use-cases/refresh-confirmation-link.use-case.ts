import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { createErrorMessage } from '../../../../common/helpers/create-error-message';
import { UsersService } from '../../../users/application/users.service';

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

    if (!user || user.emailConfirmation.isConfirmed)
      throw new BadRequestException(createErrorMessage('email'));

    const refreshConfirmationCode =
      await this.usersService.refreshConfirmationInfo(user.id);

    await this.emailService.sendEmailConfirmationLink(
      command.email,
      refreshConfirmationCode,
    );
  }
}
