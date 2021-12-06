import { Test, TestingModule } from '@nestjs/testing';
import { CalcService } from './calc.service';

describe('CalcService', () => {
  let service: CalcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalcService],
    }).compile();

    service = module.get<CalcService>(CalcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
