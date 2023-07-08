import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryHelper {
  skipHelper = (pageNumber: number, pageSize: number) => {
    return (pageNumber - 1) * pageSize;
  };

  pagesCountHelper = (totalCount: number, pageSize: number) => {
    return Math.ceil(totalCount / pageSize);
  };
}
