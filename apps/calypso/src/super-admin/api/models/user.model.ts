import { AccountType } from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'User' })
export class UserModel {
  @Field()
  id: string;
  @Field()
  login: string;
  @Field()
  email: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => String)
  accountType: AccountType;
}
