import { Character } from "./character.js";

export class SP extends Character {
    constructor(pos, side) {
        super(500, 20, pos, 'Red', side)
    }

        /**
     * 스파이더맨: 어디로든, 경로 중간에 다른 말 있어도 무시, 나머지는 로키와 같음
     * @param {*} from  ex) ['A', 3]
     * @param {*} to    ex) ['D', 6]
     * @param {*} board
     * @returns {{isMove: number, isHit: number}}
     */
    movePosition(from, to, board) {
        const posInfo = super.movePosition(from, to, board);
        let isMove = 0;
        let isHit = 0;

        const [myBoard, enemyBoard] = super.getSide()
            ? [board.userBoard, board.getComBoard()]
            : [board.getComBoard(), board.userBoard];

        // 1. 목적지에 적 있으면 공격만(이동X)
        const targetEnemy = enemyBoard.get(to[0])[+to[1] - 1];
        if (targetEnemy !== undefined) {
            isHit = 1;
            targetEnemy.decreaseHp(super.getAtkPoint());
            if (targetEnemy.getHp() <= 0) {
                enemyBoard.get(to[0])[+to[1] - 1] = undefined;
            }
            return { isHit, isMove }; // 공격만, 이동X
        }

        // 2. 목적지에 아군이 있으면 이동 불가
        const targetAlly = myBoard.get(to[0])[+to[1] - 1];
        if (targetAlly !== undefined) {
            throw Error("목적지 칸에 아군이 있어 이동 불가");
        }

        // 3. 경로 중간에 말 있어도 무시하고 바로 이동
        isMove = 1;
        super.setPos(to);

        return { isHit, isMove };
    }
}