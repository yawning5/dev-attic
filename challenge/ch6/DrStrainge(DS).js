import { Character } from "./character";

export class DS extends Character {
    constructor(pos, side) {
        super(700, 40, pos, 'Green', side)
    }

        /**
     * Dr. Strange: 십자 방향 무한 이동, 경로 중간 "아군"만 막힘, 적군은 무시
     * @param {*} from
     * @param {*} to
     * @param {*} board
     * @returns {{isMove: number, isHit: number}}
     */
    movePosition(from, to, board) {
        const posInfo = super.movePosition(from, to, board);
        let isMove = 0;
        let isHit = 0;

        const rowDiff = posInfo.toRow - posInfo.fromRow;
        const colDiff = posInfo.toColumn - posInfo.fromColumn;

        // 1. 십자 방향만 허용
        const isStraight = (rowDiff === 0 && colDiff !== 0) || (colDiff === 0 && rowDiff !== 0);
        if (!isStraight) {
            throw Error('Dr. Strange는 상하좌우 방향으로만 이동할 수 있습니다.');
        }

        // 2. 경로 중간에 "아군" 말이 있으면 이동 불가, 적군은 무시
        const rowStep = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1);
        const colStep = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1);

        const [myBoard, enemyBoard] = super.getSide()
            ? [board.userBoard, board.getComBoard()]
            : [board.getComBoard(), board.userBoard];

        let r = posInfo.fromRow + rowStep;
        let c = posInfo.fromColumn + colStep;
        while (r !== posInfo.toRow || c !== posInfo.toColumn) {
            // **아군만 체크!**
            if (myBoard.get(board.rows[r])[c] !== undefined) {
                throw Error('경로 중간에 아군이 있어 이동 불가');
            }
            r += rowStep;
            c += colStep;
        }

        // 3. 목적지에 적군이 있으면 공격만(이동X)
        const targetEnemy = enemyBoard.get(to[0])[+to[1] - 1];
        if (targetEnemy !== undefined) {
            isHit = 1;
            targetEnemy.decreaseHp(super.getAtkPoint());
            if (targetEnemy.getHp() <= 0) {
                enemyBoard.get(to[0])[+to[1] - 1] = undefined;
            }
            return { isHit, isMove };
        }

        // 4. 목적지에 아군 있으면 이동 불가
        const targetAlly = myBoard.get(to[0])[+to[1] - 1];
        if (targetAlly !== undefined) {
            throw Error("목적지 칸에 아군이 있어 이동 불가");
        }

        // 5. 이동 가능
        isMove = 1;
        super.setPos(to);

        return { isHit, isMove };
    }
}