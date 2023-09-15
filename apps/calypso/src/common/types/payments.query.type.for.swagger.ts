import { ApiProperty } from '@nestjs/swagger';
import { PaymentsTypeForSwagger } from './payments.type.for.swagger';

export class PaymentsQueryTypeForSwagger {
  @ApiProperty({ type: 'number', description: 'Number of items sorted' })
  'pagesCount': number;
  @ApiProperty({ type: 'number', description: 'Number of pages' })
  'page': number;
  @ApiProperty({ type: 'number', description: 'Page Size' })
  'pageSize': number;
  @ApiProperty({ type: 'number', description: 'Total items' })
  'totalCount': number;
  @ApiProperty({ type: [PaymentsTypeForSwagger] })
  'items': PaymentsTypeForSwagger[];
}
