import { ApiProperty } from '@nestjs/swagger';

export class PaymentsDto {
  @ApiProperty({ type: 'string' })
  productId: string;
  @ApiProperty({ type: 'number' })
  quantity: number;
}
