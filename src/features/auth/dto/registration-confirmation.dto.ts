import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationConformationDto {
  @Transform(({ value }) => value.trim())
  @ApiProperty({ type: 'string' })
  // @Validate(CheckCode)
  code: string;
}
