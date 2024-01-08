import { IsUrl, IsNotEmpty } from '@nestjs/class-validator';

export class ParseEmailDto {
  @IsNotEmpty()
  @IsUrl()
  urlOrPath: string;
}