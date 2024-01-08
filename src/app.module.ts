import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailParserModule } from './email-parser/email-parser.module';

@Module({
  imports: [EmailParserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
