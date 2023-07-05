import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreatePostCommandBus {
  constructor(public post: any[], public description: string) {}
}

@CommandHandler(CreatePostCommandBus)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommandBus>
{
  constructor() {}

  async execute(command: CreatePostCommandBus): Promise<boolean> {
    return true;
  }
}
