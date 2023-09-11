import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';

export class CancelSubscriptionAndSendMessageCommand {
  constructor(public userId: string) {}
}

@CommandHandler(CancelSubscriptionAndSendMessageCommand)
export class CancelSubscriptionAndSendMessageUseCase
  implements ICommandHandler<CancelSubscriptionAndSendMessageCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailAdapter: EmailAdapter,
  ) {}

  async execute(
    command: CancelSubscriptionAndSendMessageCommand,
  ): Promise<any> {
    const user: UserEntity =
      await this.usersRepository.updateAccountTypeForUser(
        command.userId,
        'Personal',
      );
    if (user) {
      await this.emailAdapter.sendEmailForCancelSubscription(user.email);
    } else {
      throw new BadRequestException({
        field: 'userId',
        message: 'Bad user id',
      });
    }
  }
}
