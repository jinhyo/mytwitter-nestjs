import { Test, TestingModule } from '@nestjs/testing';
import { MyJwtService } from './my-jwt.service';

describe('MyJwtService', () => {
  let service: MyJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyJwtService],
    }).compile();

    service = module.get<MyJwtService>(MyJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
