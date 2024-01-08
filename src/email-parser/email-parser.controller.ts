import { Controller, Get, Param } from '@nestjs/common';
import { EmailParserService } from './email-parser.service';
import { ParseEmailDto } from './email-parser.dto';

@Controller('email-parser')
export class EmailParserController {

    constructor(private readonly mailParserService: EmailParserService) {}

    @Get(':urlOrPath')
    async parseEmail(@Param() params: ParseEmailDto): Promise<any> {
      const result = await this.mailParserService.parseEmail(params.urlOrPath);
      if (result) {
        return result;
      } else {
        return { error: 'No JSON found.' };
      }
    }
}
