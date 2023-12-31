import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { createErrorMessage } from '../../../../common/helpers/create-error-message';
import { ConfirmationInfoEntity } from '../../../users/entities/confirmation-info.entity';

export class ConfirmationEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmationEmailCommand)
export class ConfirmationEmailUseCase
  implements ICommandHandler<ConfirmationEmailCommand>
{
  constructor(private userRepo: UsersRepository) {}
  async execute(
    command: ConfirmationEmailCommand,
  ): Promise<ConfirmationInfoEntity> {
    const confirmationInfo: ConfirmationInfoEntity =
      await this.userRepo.getConfirmationInfoByCode(command.code);

    if (
      !confirmationInfo ||
      confirmationInfo.isConfirmed ||
      confirmationInfo.expirationDate < new Date()
    )
      throw new BadRequestException(createErrorMessage('code'));

    return this.userRepo.updateStatusConfirmationEmail(command.code);
  }
}
