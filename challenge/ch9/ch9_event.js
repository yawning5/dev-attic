export class Event {
    constructor(eventName, sender, userData = {}, completed = false) {
        this.eventName = eventName ?? "";   // "" 허용(와일드카드 매칭 대비)
        this.sender = sender ?? null;       // 발행자 객체(설명 가능 객체 권장)
        this.userData = userData ?? {};     // 부가 정보(얕은 컨테이너)
        this.completed = !!completed;       // 진행상태(여러 번 중 마지막 여부 등)
        this.postedAt = new Date();         // 생성(발행) 시각 스냅샷
    }

    toString() {
        const s = typeof this.sender?.description === 'function'
            ? this.sender.description()
            : 'unknown sender';
        return `Event: "${this.eventName}" from ${s} (Data: ${JSON.stringify(this.userData)}, Completed: ${this.completed})`;
    }
}