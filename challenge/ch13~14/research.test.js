import fs from 'fs';
import path from 'path';
import { writeIndex } from './research.js';
import { readIndex } from './readfile.js';

// 테스트용 임시폴더
const TEST_DIR = '__test_git';
const GIT_DIR = path.join(TEST_DIR, '.git');
const INDEX_PATH = path.join(GIT_DIR, 'index');
const TEST_FILE1 = path.join(TEST_DIR, 'foo.txt');
const TEST_FILE2 = path.join(TEST_DIR, 'bar.txt');

beforeEach(() => {
  // 테스트 폴더/파일 초기화
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
  fs.mkdirSync(path.join(GIT_DIR, 'objects'), { recursive: true });
  fs.writeFileSync(TEST_FILE1, 'abc');
  fs.writeFileSync(TEST_FILE2, 'xyz');
});

afterEach(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
});

test('writeIndex & readIndex round-trip', () => {
  // 1. entry 배열 준비 (stat이 실제로 있는 파일이어야 함)
  const entries = [
    { mode: '100644', name: 'foo.txt', hash: 'a'.repeat(40) },
    { mode: '100644', name: 'bar.txt', hash: 'b'.repeat(40) },
  ];
  // 2. writeIndex로 저장
  process.chdir(TEST_DIR); // 반드시 TEST_DIR에서 실행!
  writeIndex(entries);

  // 3. readIndex로 다시 읽기
  const readEntries = readIndex();

  // 4. 값 비교
  expect(readEntries.length).toBe(2);
  expect(readEntries[0].name).toBe('foo.txt');
  expect(readEntries[0].hash).toBe('a'.repeat(40));
  expect(readEntries[1].name).toBe('bar.txt');
  expect(readEntries[1].hash).toBe('b'.repeat(40));
  process.chdir('..');
});
