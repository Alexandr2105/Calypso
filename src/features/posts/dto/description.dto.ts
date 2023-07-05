import { Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class DescriptionDto {
  @Transform(({ value }) => String(value).trim())
  @Length(0, 3)
  description: string;
}
