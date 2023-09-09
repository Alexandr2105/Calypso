import { ApiProperty } from '@nestjs/swagger';

export class ErrorMessage {
  @ApiProperty({ type: 'string' })
  message: string;
  @ApiProperty({ type: 'string' })
  field: string;
}

export class ErrorsMessageForSwaggerType {
  @ApiProperty({ type: [ErrorMessage] })
  errorsMessages: ErrorMessage[];
}
