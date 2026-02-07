import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

// jest.mock() 을 이용해서 실제 DB 호출 없이 테스트 가능

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  // PrismaService를 mock으로 설정
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(), // jest.fn()을 사용하여 mock 함수 생성
    },
    // 필요한 다른 메서드들도 여기에 추가할 수 있습니다.
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ // NestJS 테스트 모듈 생성
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 mock 함수 호출 기록 초기화
  });

  // it << 테스트 케이스를 작성하는 곳
  
  it('이메일로 유저를 정상적으로 찾는다', async () => {
    // given
    const testUser = {
      id: 1,
      email: 'hello@test.com',
      password: 'hash'
    };
    mockPrismaService.user.findUnique.mockResolvedValue(testUser);

    // when
    const user = await service.findByEmail('hello@test.com');

    // then
    // expect(..) 로 반환값, 호출 여부 등 검증
    expect(user).toEqual(testUser);
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'hello@test.com' },
    });
  });


  it('존재하지 않는 유저 이메일이면 null 반환', async() => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    const user = await service.findByEmail('notfound@test.com');
    expect(user).toBeNull();
  });
});