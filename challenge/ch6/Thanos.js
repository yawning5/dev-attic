import { Character } from "./character.js";

export class Thanos extends Character {
    constructor(pos, side, pocket) {
        super(1000, 100, pos, 'Any', side)
        if (!pocket || typeof pocket !== 'object') {
            throw new Error('타노스 pocket 설정 필요');
        }
        this.pocket = pocket;
    }

    /**
     * @param {string} from  예: "A1"
     * @param {string} to    예: "C4"
     * @param {Board}  board 전체 보드 상태 객체
     * @returns {{isMove:number, isHit:number}}
     */
    movePosition(from, to, board) {
        const posInfo = super.movePosition(from, to, board);
        let isMove = 0;
        let isHit = 0;

        // (1) 아군/적군 보드 분리
        const [myBoard, enemyBoard] = super.getSide()
            ? [board.userBoard, board.getComBoard()]
            : [board.getComBoard(), board.userBoard];

        const rowLetter = to[0];          // 'A'..'F'
        const colNumber = Number(to[1]);  // 1..6
        const colIdx = colNumber - 1;  // 0..5 (배열 인덱스)

        // 현재 줄(행) 배열 확보 (없으면 빈 배열로 처리)
        const allyRowArr = myBoard.get(rowLetter) || Array(6).fill(undefined);
        const enemyRowArr = enemyBoard.get(rowLetter) || Array(6).fill(undefined);

        // ───── (2) 공격 우선 판정 ─────
        const destEnemy = enemyRowArr[colIdx];
        if (destEnemy !== undefined) {
            isHit = 1;
            destEnemy.decreaseHp(super.getAtkPoint());
            if (destEnemy.getHp() <= 0) {
                enemyRowArr[colIdx] = undefined; // 적 제거
            } else if (destEnemy.getHp() <= 50) {
                if (destEnemy.pocket) {
                    this.thanosGetStone(destEnemy)
                }
            }
            return { isHit, isMove }; // 이동 없이 턴 종료
        }

        // ───── (3) 목적지에 아군 있으면 이동 불가 ─────
        if (allyRowArr[colIdx] !== undefined) {
            throw Error("목적지 칸에 아군이 있어 이동할 수 없습니다.");
        }

        // ───── (4) 가로 2칸 점유 조건 검사 ─────
        const leftIdx = colIdx - 1;
        const rightIdx = colIdx + 1;

        // 보조 함수: 특정 칸이 완전히 비어 있는지(아군+적군 모두 없음)
        const isEmpty = (idx) => idx >= 0 && idx <= 5 && allyRowArr[idx] === undefined && enemyRowArr[idx] === undefined;

        let canOccupy = false;
        if (colNumber === 1) {
            canOccupy = isEmpty(rightIdx);
        } else if (colNumber === 6) {
            canOccupy = isEmpty(leftIdx);
        } else {
            canOccupy = isEmpty(leftIdx) || isEmpty(rightIdx);
        }

        if (!canOccupy) {
            throw Error("가로 2칸(좌·우) 중 어느 한 칸도 비어있지 않아 이동할 수 없습니다.");
        }

        // ───── (5) 이동 수행 ─────
        isMove = 1;
        super.setPos(to); // 실제 보드 갱신은 Board 클래스 내부 로직에 위임
        return { isHit, isMove };
    }
}