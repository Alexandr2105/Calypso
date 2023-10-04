import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Post' })
export class PostModel {
  @Field()
  id: string;
  @Field()
  userId: string;
  @Field({ nullable: true })
  description: string;
  @Field(() => Date)
  createdAt: Date;
}
