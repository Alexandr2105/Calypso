import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Information about image' })
export class ImageModel {
  @Field()
  id: string;
  @Field()
  url: string;
  @Field()
  userId: string;
  @Field()
  postId: string;
  @Field(() => String)
  createdAt: Date;
}
