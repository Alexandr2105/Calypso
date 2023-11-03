import { NestDataLoader } from 'nestjs-dataloader';
import { Inject, Injectable } from '@nestjs/common';
import { ImageModel } from '../../super-admin/api/models/image.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import DataLoader from 'dataloader';

@Injectable()
export class FilesLoaderForGraphql
  implements NestDataLoader<string, ImageModel>
{
  constructor(@Inject('FILES_SERVICE_TCP') private clientTCP: ClientProxy) {}

  generateDataLoader(): DataLoader<string, ImageModel | null> {
    return new DataLoader<string, ImageModel | null>(
      async (usersIds: string[]) => {
        const pattern = { cmd: 'getAllPhotos' };
        const data = await firstValueFrom(
          this.clientTCP.send(pattern, usersIds),
        );
        return usersIds.map((id) => {
          return data.filter((images) => images.userId === id) || null;
        });
      },
    );
  }
}
