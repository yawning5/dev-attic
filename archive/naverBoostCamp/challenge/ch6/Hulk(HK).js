import { Character } from "./character.js";

export class HK extends Character{
        constructor(pos, side) {
        super(800, 50, pos, 'White', side)
    }

        /**
     * 헐크: 위/아래 무제한 직선 이동, 경로/목적지 아군 막힘, 공격 시 이동 안 함
     * @param {*} from  ex) ['A', 3]
     * @param {*} to    ex) ['E', 3]
     * @param {*} board
     * @returns {{isMove: number, isHit: number}}
     */
    movePosition(from, to, board) {
        const posInfo = super.movePosition(from, to, board);
        let isMove = 0;
        let isHit = 0;

        const rowDiff = posInfo.toRow - posInfo.fromRow;
        const colDiff = posInfo.toColumn - posInfo.fromColumn;
        if (colDiff !== 0 || rowDiff === 0) {
            throw Error('Hulk는 위/아래(수직) 방향으로만 이동할 수 있습니다.');
        }

        const rowStep = rowDiff > 0 ? 1 : -1;
        const [myBoard, enemyBoard] = super.getSide()
            ? [board.userBoard, board.getComBoard()]
            : [board.getComBoard(), board.userBoard];

        const targetEnemy = enemyBoard.get(to[0])[+to[1] - 1];
        if (targetEnemy !== undefined) {
            // 공격만 하고 이동X, 경로는 신경 안 씀
            isHit = 1;
            targetEnemy.decreaseHp(super.getAtkPoint());
            if (targetEnemy.getHp() <= 0) {
                enemyBoard.get(to[0])[+to[1] - 1] = undefined;
            }
            return { isHit, isMove };
        }

        const targetAlly = myBoard.get(to[0])[+to[1] - 1];
        if (targetAlly !== undefined) {
            throw Error("목적지 칸에 아군이 있어 이동 불가");
        }

        let r = posInfo.fromRow + rowStep;
        let c = posInfo.fromColumn;
        while (r !== posInfo.toRow) {
            if (myBoard.get(board.rows[r])[c] !== undefined) {
                throw Error('경로 중간에 아군이 있어 이동 불가');
            }
            r += rowStep;
        }

        isMove = 1;
        super.setPos(to);
        return { isHit, isMove };
    }
}