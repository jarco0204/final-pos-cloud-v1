import { Test, TestingModule } from '@nestjs/testing';
import { MongooseLogicalSessionService } from './mongoose-logical-session.service';

describe('MongooseLogicalSessionService', () => {
  let service: MongooseLogicalSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseLogicalSessionService],
    }).compile();

    service = module.get<MongooseLogicalSessionService>(MongooseLogicalSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
