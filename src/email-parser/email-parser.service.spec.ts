import { Test, TestingModule } from '@nestjs/testing';
import { EmailParserService } from './email-parser.service';

describe('EmailParserService', () => {
  let service: EmailParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailParserService],
    }).compile();

    service = module.get<EmailParserService>(EmailParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
