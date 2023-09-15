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
  @Field(() => Boolean)
  isDeleted: boolean;
  @Field(() => AccountType)
  accountType: AccountType;
  @Field({ nullable: true })
  passwordHash?: string;
  @Field({ nullable: true })
  googleAuthId?: string;
  @Field({ nullable: true })
  githubAuthId?: string;
}
