import { Character } from "./character";

export class BW extends Character {
    constructor(pos, side) {
        super(400, 10, pos, 'Orange', side)
    }

    movePosition(from, to, board) {
        const posInfo = super.movePosition(from, to, board);
        let isMove = 0;
        let isHit = 0;

        if ((Math.abs(posInfo.fromRow - posInfo.toRow) > 1) ||
            (Math.abs(posInfo.fromColumn - posInfo.toColumn) > 1)) {
            throw Error`움직임 조건에 맞지 않는 명령`
        }

        const [myBoard, enemyBoard] = super.getSide()
            ? [board.userBoard, board.getComBoard()]    // side === 1 (user)
            : [board.getComBoard(), board.userBoard];   // side === 0 (com)


        const targetEnemy = enemyBoard.get(to[0])[+to[1] - 1];
        const targetAlly = myBoard.get(to[0])[+to[1] - 1];

        if (targetEnemy !== undefined) {
            isHit = 1;
            targetEnemy.decreaseHp(super.getAtkPoint());
            if (targetEnemy.getHp() <= 0 ) {
                enemyBoard.get(to[0])[+to[1] - 1] = undefined;
            }
        } else if (targetAlly === undefined) {
            isMove = 1;
            super.setPos(to);
        }

        return { isHit, isMove };
    }
}
