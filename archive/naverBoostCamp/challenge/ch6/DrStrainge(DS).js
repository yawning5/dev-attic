import { Character } from "./character.js";

export class DS extends Character {
  constructor(pos, side) {
    // HP 700, ATK 40, 스톤 색상 Green
    super(700, 40, pos, "Green", side);
  }

  /**
   * @param {string} from  예: "A1"
   * @param {string} to    예: "B3"
   * @param {Board}  board 전체 보드 상태 객체
   * @returns {{isMove:number, isHit:number}}
   */
  movePosition(from, to, board) {
    const posInfo = super.movePosition(from, to, board);
    let isMove = 0;
    let isHit = 0;


    // 1. 직선(상·하·좌·우) 여부 검사
    const rowDiff = posInfo.toRow - posInfo.fromRow;
    const colDiff = posInfo.toColumn - posInfo.fromColumn;
    const isStraight = (rowDiff === 0 && colDiff !== 0) || (colDiff === 0 && rowDiff !== 0);
    if (!isStraight) {
      throw Error("Dr. Strange는 상하좌우 방향으로만 이동할 수 있습니다.");
    }

    // 보드 참조 분리 (내 편 / 상대 편)
    const [myBoard, enemyBoard] = super.getSide()
      ? [board.userBoard, board.getComBoard()]
      : [board.getComBoard(), board.userBoard];

    const destRowIdx = +to[1] - 1;

    const destEnemyRow = enemyBoard.get(to[0]);
    const destEnemy   = destEnemyRow && destEnemyRow[destRowIdx];

    // 2. 목적지에 적군이 있으면 → 공격 후 턴 종료 (이동하지 않음)
    //    (아군 유무와 관계없이 적 우선 처리)
    if (destEnemy !== undefined) {
      isHit = 1;
      destEnemy.decreaseHp(super.getAtkPoint());
      if (destEnemy.getHp() <= 0) {
        destEnemyRow[destRowIdx] = undefined; // 적 제거
      }
      return { isHit, isMove }; // 이동 없음
    }

    // 3. 적군이 없으면 아군 여부 체크
    const destAllyRow = myBoard.get(to[0]);
    const destAlly   = destAllyRow && destAllyRow[destRowIdx];
    if (destAlly !== undefined) {
      throw Error("목적지 칸에 아군이 있어 이동 불가");
    }

    // 4. 빈 칸 → 이동 수행
    isMove = 1;
    super.setPos(to);

    return { isHit, isMove };
  }
}
