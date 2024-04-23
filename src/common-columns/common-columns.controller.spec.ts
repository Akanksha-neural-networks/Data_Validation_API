import { Test, TestingModule } from '@nestjs/testing';
import { CommonColumnsController } from './common-columns.controller';

describe('CommonColumnsController', () => {
  let controller: CommonColumnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonColumnsController],
    }).compile();

    controller = module.get<CommonColumnsController>(CommonColumnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
