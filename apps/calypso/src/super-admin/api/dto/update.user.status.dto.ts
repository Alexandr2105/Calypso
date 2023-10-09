import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class UpdateUserStatusDto {
  @Field()
  userId: string;
  @Field(() => Boolean)
  banStatus: boolean;
}
