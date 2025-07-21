/* ───────── 캐릭터 import ───────── */
import { Thanos }           from "./Thanos.js";
import { BW }               from "./BlackWidow(BW).js";
import { HK }               from "./Hulk(HK).js";
import { DS }               from "./DrStrainge(DS).js";
import { LK }               from "./Loki(LK).js";
import { TR }               from "./Thor(TR).js";
import { SP }               from "./SpiderMan(SP).js";

/* ───────── 유틸 ───────── */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/* ───────── 제한 테이블 ───────── */
const LIMITS = {
  Thanos: { min: 2, max: 2, rows: ['A', 'B', 'C'], width: 2 },
  BW:     { min: 1, max: 2, rows: ['D', 'E'] },
  HK:     { min: 0, max: 2, rows: ['D', 'E'] },
  DS:     { min: 1, max: 3, rows: ['D', 'E'] },
  LK:     { min: 0, max: 3, rows: ['D', 'E'] },
  TR:     { min: 1, max: 1, rows: ['D', 'E'] },
  SP:     { min: 0, max: 1, rows: ['D', 'E'] },
};

/* ───────── Board 클래스 ───────── */
class Board {
  columns = [['A', []], ['B', []], ['C', []], ['D', []], ['E', []]];
  rows    = ['A', 'B', 'C', 'D', 'E'];
  #comBoard;

  constructor() {
    const blank = () => new Map(this.columns.map(([r]) => [r, new Array(6).fill(undefined)]));
    this.userBoard = blank();
    this.#comBoard = blank();
    this.totalHP   = 'HP = ' + 1;
  }

  /* ── 공통 헬퍼 ── */
  rowIdx(c)      { return this.rows.indexOf(c); }
  pieceAt(b, [r, c])   { return b.get(r)[c - 1]; }
  setPiece(b, [r, c], v) { b.get(r)[c - 1] = v; }
  inside(r, c)   { return r >= 0 && r < 5 && c >= 0 && c < 6; }

  /* 보드별 합계·타입별 카운트 */
  totalPieces(b) { return [...b.values()].flat().filter(Boolean).length; }
  countPieces(b, type) {
    const s = new Set();
    for (const arr of b.values()) for (const p of arr)
      if (p?.constructor?.name === type) s.add(p);
    return s.size;
  }

  /* ── 제한 검사 + 배치 ── */
  addPiece(piece, board, isInitial = true) {
    const type = piece.constructor.name;
    const lim  = LIMITS[type];
    if (!lim) throw Error('알 수 없는 타입 ' + type);

    const [row, col] = piece.getPos();
    if (!this.inside(this.rowIdx(row), col - 1)) throw Error('보드 밖');

    if (isInitial) {
      if (!lim.rows.includes(row)) throw Error(`${type} 행 제한`);
      if (this.countPieces(board, type) >= lim.max) throw Error(`${type} 최대 초과`);
    }

    /* Thanos 2칸 */
    if (type === 'Thanos') {
      const colR = col + 1;
      if (colR > 6) throw Error('Thanos 오른쪽 칸이 보드 밖');
      if (this.pieceAt(board, [row, col]) || this.pieceAt(board, [row, colR]))
        throw Error('Thanos 자리 겹침');
      this.setPiece(board, [row, col],  piece);
      this.setPiece(board, [row, colR], piece);
      return;
    }

    if (this.pieceAt(board, [row, col])) throw Error('칸 점유');
    this.setPiece(board, [row, col], piece);
  }

  /* ── 랜덤 스폰 (대상 보드 param) ── */
  #spawnRandom(type, board) {
    const lim = LIMITS[type];
    while (true) {
      const row = lim.rows[rand(0, lim.rows.length - 1)];
      const col = type === 'Thanos' ? rand(1, 5) : rand(1, 6);
      const side = (board === this.userBoard) ? 1 : 0;

      const piece = ({
        Thanos: () => new Thanos([row, col], side, {}),
        BW:     () => new BW([row, col], side),
        HK:     () => new HK([row, col], side),
        DS:     () => new DS([row, col], side),
        LK:     () => new LK([row, col], side),
        TR:     () => new TR([row, col], side),
        SP:     () => new SP([row, col], side),
      })[type]();

      try { this.addPiece(piece, board, true); return; }
      catch { /* 자리 겹침 → 재시도 */ }
    }
  }

  /* ── 두 보드 모두 8개 초기화 ── */
  randomInitialSetup() {
    ['userBoard', '#comBoard'].forEach(key => {
      const board = key === 'userBoard' ? this.userBoard : this.#comBoard;

      /* 필수 5개 */
      ['Thanos','Thanos','BW','DS','TR'].forEach(t => this.#spawnRandom(t, board));

      /* 나머지 3개 */
      while (this.totalPieces(board) < 8) {
        const avail = Object.keys(LIMITS)
          .filter(t => this.countPieces(board, t) < LIMITS[t].max);
        this.#spawnRandom(avail[rand(0, avail.length - 1)], board);
      }
    });
  }

  /* ── 출력 (어느 보드든 인자로) ── */
  #print(board) {
    const header = ' |' + [...Array(6).keys()].map(i => String(i+1).padStart(2,'0')+'|').join('');
    console.log(header);
    for (const r of this.rows) {
      let line = r + '|';
      for (let c = 1; c <= 6; c++) {
        const p = this.pieceAt(board, [r, c]);
        let v = '..';
        if (p) v = p instanceof Thanos ? 'TA' : p.constructor.name.slice(0,2);
        line += v.padEnd(2,' ') + '|';
      }
      console.log(line);
    }
    console.log(header);
  }

  display() {
    console.log('\n=== YOUR BOARD ===');
    this.#print(this.userBoard);
    console.log('\n=== COM BOARD ===');
    this.#print(this.#comBoard);
  }
}

/* ───────── 실행 예시 ───────── */
const board = new Board();
board.randomInitialSetup();
board.display();
