import { Test, TestingModule } from '@nestjs/testing';
import { EmailParserController } from './email-parser.controller';

describe('EmailParserController', () => {
  let controller: EmailParserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailParserController],
    }).compile();

    controller = module.get<EmailParserController>(EmailParserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
