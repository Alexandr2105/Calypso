import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../../../../common/bcript/bcript.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { createErrorMessage } from '../../../../common/helpers/create-error-message';

export class ChangePasswordCommand {
  constructor(public recoveryCode: string, public newPassword: string) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(
    private bcryptService: BcryptService,
    private userRepo: UsersRepository,
  ) {}
  async execute(command: ChangePasswordCommand): Promise<void> {
    const user = await this.userRepo.getUserByRecoveryCode(
      command.recoveryCode,
    );

    if (!user || user.emailConfirmation.expirationDate < new Date())
      throw new BadRequestException(createErrorMessage('code'));

    const hash = await this.bcryptService.generateHashForNewUser(
      command.newPassword,
    );

    await this.userRepo.changePassword(user.id, hash);
  }
}
