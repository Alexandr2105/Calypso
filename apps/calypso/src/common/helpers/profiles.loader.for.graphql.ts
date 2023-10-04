import DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';
import { ProfileModel } from '../../super-admin/api/models/profile.model';
import { UsersProfilesRepository } from '../../features/users-profiles/infrastructure/users.profiles.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfilesLoaderForGraphql
  implements NestDataLoader<string, ProfileModel>
{
  constructor(private usersProfilesRepository: UsersProfilesRepository) {}

  generateDataLoader(): DataLoader<string, ProfileModel | null> {
    return new DataLoader<string, ProfileModel | null>(
      async (usersIds: string[]) => {
        const data = await this.usersProfilesRepository.getAllProfiles(
          usersIds,
        );
        return usersIds.map((id) => {
          return data.find((profile) => profile.userId === id) || null;
        });
      },
    );
  }
}
