import { Character } from "./character";

export class TR extends Character {
    constructor(pos, side) {
        super(900, 50, pos, 'Violet', side)
    }

        /**
     * 토르: 대각선, 상하좌우 무한 이동, 경로 중간에 말 있으면 이동/공격 불가, 나머지는 로키와 같음
     * @param {*} from  ex) ['A', 3]
     * @param {*} to    ex) ['D', 6]
     * @param {*} board
     * @returns {{isMove: number, isHit: number}}
     */
    movePosition(from, to, board) {
        const posInfo = super.movePosition(from, to, board);
        let isMove = 0;
        let isHit = 0;

        const rowDiff = posInfo.toRow - posInfo.fromRow;
        const colDiff = posInfo.toColumn - posInfo.fromColumn;

        const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff !== 0;
        const isStraight = (rowDiff === 0 && colDiff !== 0) || (colDiff === 0 && rowDiff !== 0);
        if (!isDiagonal && !isStraight) {
            throw Error('Thor는 대각선 또는 상하좌우 방향으로만 이동할 수 있습니다.');
        }

        const rowStep = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1);
        const colStep = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1);
        const [myBoard, enemyBoard] = super.getSide()
            ? [board.userBoard, board.getComBoard()]
            : [board.getComBoard(), board.userBoard];

        const targetEnemy = enemyBoard.get(to[0])[+to[1] - 1];
        if (targetEnemy !== undefined) {
            // 공격만, 이동X, 경로 신경 안 씀
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
        let c = posInfo.fromColumn + colStep;
        while (r !== posInfo.toRow || c !== posInfo.toColumn) {
            if (myBoard.get(board.rows[r])[c] !== undefined) {
                throw Error('경로 중간에 아군이 있어 이동 불가');
            }
            r += rowStep;
            c += colStep;
        }

        isMove = 1;
        super.setPos(to);
        return { isHit, isMove };
    }
}