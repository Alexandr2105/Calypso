import { ApiProperty } from '@nestjs/swagger';

export class DataPaymentsForSwagger {
  @ApiProperty({ type: 'string' })
  productId: string;
  @ApiProperty({ type: 'number' })
  quantity: number;
}
