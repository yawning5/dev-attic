import { VectorDB } from './VectorDB.js';
import { VectorService } from './VectorService.js';
import { jest } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';

// 파일 입출력을 피하기 위한 mockFs 대체
class MockFs {
  constructor() {
    this.files = new Map();
  }

  async readFile(p, encoding) {
    if (!this.files.has(p)) throw new Error('File not found');
    return this.files.get(p);
  }

  async writeFile(p, data) {
    this.files.set(p, data);
  }
}

describe('VectorDB 기능 검사', () => {
  const dim = 3;
  const baseDir = '.';
  const dbFile = path.join(baseDir, `${dim}vector.json`);
  let mockFs;
  let db;

  beforeEach(async () => {
    mockFs = new MockFs();
    // 초기 파일 세팅
    const initData = JSON.stringify([
      { id: 0, sentence: 'hello', vector: [1, 0, 0] },
      { id: 1, sentence: 'world', vector: [0, 1, 0] }
    ]);
    await mockFs.writeFile(dbFile, initData);

    db = new VectorDB(dim, baseDir, mockFs);
    await db.init();
  });

  test('init() - 데이터 로드 및 lastId 설정', () => {
    expect(db.data.length).toBe(2);
    expect(db.lastId).toBe(2);
  });

  test('add() - 정상적인 벡터 추가', async () => {
    await db.add({ sentence: 'new', vector: [0, 0, 1] });
    expect(db.data.length).toBe(3);
    expect(db.data[2].id).toBe(2);
    const saved = JSON.parse(await mockFs.readFile(dbFile));
    expect(saved.length).toBe(3);
  });

  test('add() - 차원 불일치 시 에러 발생', async () => {
    await expect(db.add({ sentence: 'bad', vector: [1, 2] }))
      .rejects
      .toThrow('차원 불일치');
  });

  test('removeById() - 기존 ID 삭제', async () => {
    await db.removeById(1);
    expect(db.data.length).toBe(1);
    expect(db.data.find(r => r.id === 1)).toBeUndefined();
  });

  test('removeById() - 존재하지 않는 ID는 무시', async () => {
    await db.removeById(999);
    expect(db.data.length).toBe(2);
  });
});

describe('VectorService 기능 검사', () => {
  let mockDB;
  let service;

  beforeEach(async () => {
    mockDB = {
      add: jest.fn(),
      removeById: jest.fn(),
      knn: jest.fn()
    };

    const mockConvert = jest.fn(async (input) => [1, 0, 0]);

    service = new VectorService(384, mockDB);
    service.convert = mockConvert; // convert 함수 모킹 덮어쓰기
    await service.init(); // 실제론 아무 일 안 함 (db 주입됨)
  });

  test('addRecord() - 벡터 변환 후 DB 저장', async () => {
    await service.addRecord('테스트 문장');

    expect(service.convert).toHaveBeenCalledWith('테스트 문장');
    expect(mockDB.add).toHaveBeenCalledWith({
      id: 0,
      sentence: '테스트 문장',
      vector: [1, 0, 0]
    });
  });

  test('removeRecord() - 지정 ID로 삭제', async () => {
    await service.removeRecord(5);
    expect(mockDB.removeById).toHaveBeenCalledWith(5);
  });

  test('findRecord() - knn 호출만 확인', async () => {
    await service.findRecord('비교 문장');
    expect(mockDB.knn).toHaveBeenCalledWith('비교 문장');
  });
});