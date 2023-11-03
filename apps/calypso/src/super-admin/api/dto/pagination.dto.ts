import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationDto {
  @Field({ defaultValue: 'createdAt', nullable: true })
  sortBy: string;
  @Field({ defaultValue: 'desc', nullable: true })
  sortDirection: string;
  @Field(() => Int, { defaultValue: 1, nullable: true })
  pageNumber: number;
  @Field(() => Int, { defaultValue: 10, nullable: true })
  pageSize: number;
  @Field({ defaultValue: '', nullable: true })
  searchName: string;
}
