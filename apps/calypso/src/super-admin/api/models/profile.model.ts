import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Profile' })
export class ProfileModel {
  @Field()
  userId: string;
  @Field()
  login: string;
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  lastName: string;
  @Field({ nullable: true })
  dateOfBirthday: string;
  @Field({ nullable: true })
  city: string;
  @Field({ nullable: true })
  userInfo: string;
  @Field({ nullable: true })
  photo: string;
}
