import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Profile' })
export class ProfileModel {
  @Field()
  userId: string;
  @Field()
  login: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  dateOfBirthday: string;
  @Field()
  city: string;
  @Field()
  userInfo: string;
  @Field()
  photo: string;
}
