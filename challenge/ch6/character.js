export class Character {

    #side
    #hp;
    #atkPoint;
    #pos;
    #stoneType
    pocket

    /**
     * 
     * @param {*} hp 체력수치
     * @param {*} atkPoint 공격수치
     * @param {*} pos 현재 위치
     * @param {*} stoneType 가질 수 있는 스톤 타입
     * @param {*} side 0 = computer, 1 = user
     */
    constructor(hp, atkPoint, pos, stoneType, side) {
        if ([hp, atkPoint, pos, stoneType, side].some(v => v === undefined)) {
            throw new Error(`[${this.constructor.name}] 모든 인자를 반드시 지정해야 합니다.`);
        }
        this.#hp = hp;
        this.#atkPoint = atkPoint;
        this.#pos = pos;
        this.#stoneType = stoneType;
        this.#side = side;
    }

    getAtkPoint() {
        return this.#atkPoint;
    }

    getHp() {
        return this.#hp;
    }

    getPos() {
        return this.#pos;
    }

    getStoneType() {
        return this.#stoneType;
    }

    getSide() {
        return this.#side;
    }

    setPos(newPos) {
        this.#pos = newPos
    }

    decreaseHp(atkPoint) {
        this.#hp = this.#hp - atkPoint
    }

    /**
     * 
     * @param {*} from 
     * @param {*} to 
     * @param {*} board 
     * @returns 
     *  ~Row: 각 줄의 알파벳을 숫자로 바꾼 값 A ~ E 0 ~ 4
     *  ~column: 세로 줄의 숫자 값 1 ~ 6
     */
    movePosition(from, to, board) {
        if (from !== this.getPos()) {
            throw new Error(`${this.constructor.name} 의 현재위치 ${this.getPos()} 입력 받은 출발 위치 ${from}`)
        }

        const fromRow = board.row.findIndex(from[0]);
        const toRow = board.row.findIndex(to[0]);
        const fromColumn = from[1];
        const toColumn = to[1];

        return { fromRow, toRow, fromColumn, toColumn };
    }
}