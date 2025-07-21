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

    setPos() {
        return this.#pos;
    }

    attackPattern() {
        throw new Error(`[${this.constructor.name}] 클래스의 attackPattern() 메서드를 반드시 구현하세요.`);
    }

    decreaseHp(atkPoint) {
        this.#hp = this.#hp - atkPoint
    }

    movePosition(movement) {
        throw new Error(`[${this.constructor.name}] 클래스의 movePosition(pos) 메서드를 반드시 구현하세요.`);
    }
}