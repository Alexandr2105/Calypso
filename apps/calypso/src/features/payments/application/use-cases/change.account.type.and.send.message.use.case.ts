import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';
import { AccountType } from '@prisma/client';
import { FormatDate } from '../../../../common/helpers/format.date';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../../users/entities/user.entity';

export class ChangeAccountTypeAndSendMessageCommand {
  constructor(
    public userId: string,
    public accountType: AccountType,
    public date: Date,
  ) {}
}

@CommandHandler(ChangeAccountTypeAndSendMessageCommand)
export class ChangeAccountTypeAndSendMessageUseCase
  implements ICommandHandler<ChangeAccountTypeAndSendMessageCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailAdapter: EmailAdapter,
    private formatDate: FormatDate,
  ) {}

  async execute(
    command: ChangeAccountTypeAndSendMessageCommand,
  ): Promise<boolean | void> {
    const user: UserEntity =
      await this.usersRepository.updateAccountTypeForUser(
        command.userId,
        command.accountType,
      );
    if (user) {
      const formDate: string = this.formatDate.dateForm_xx_xx_xxxx(
        command.date,
      );
      await this.emailAdapter.sendEmailForPayments(user.email, formDate);
    } else {
      throw new BadRequestException({
        field: 'userId',
        message: 'Bad user id',
      });
    }
  }
}
