import { Test, TestingModule } from '@nestjs/testing';
import { CommonColumnsService } from './common-columns.service';

describe('CommonColumnsService', () => {
  let service: CommonColumnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonColumnsService],
    }).compile();

    service = module.get<CommonColumnsService>(CommonColumnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
