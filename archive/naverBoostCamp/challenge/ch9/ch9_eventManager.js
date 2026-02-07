import { Event } from "./ch9_event.js";
import { EventEmitter } from 'events';

const RUN = '__run__'; // 내부 이벤트 채널 (큐에서 핸들러 실행 트리거)

function who(x) {
    if (!x) return 'null';
    if (typeof x.description === 'function') return x.description();
    return x.name || 'obj';
}

export class EventManager {
    static _instance = null; // 싱글톤 보관

    constructor() {
        // 싱글톤 보장
        if (EventManager._instance) return EventManager._instance;

        // 구독 테이블: 간단 구현(O(n) 탐색)
        this._subs = [];
        this._idSeq = 0;

        // 큐 엔드포인트: 스켈줄링은 post 단계에서 setImmediate/setTimeout으로 예약
        // 여기서는 예약된 콜백을 받아 handler 만 호출한다
        this._emitters = {
            async: new EventEmitter(),
            delay: new EventEmitter(),
        }

        // 큐에서 실제 핸들러 실행 (completed 플래그도 함께 전달)
        // on: 해당 이벤트가 발생하면 콜백 실행
        this._emitters.async.on(RUN, ({ reg, ev }) => reg.handler(ev, ev.completed));
        this._emitters.delay.on(RUN, ({ reg, ev }) => reg.handler(ev, ev.completed));

        EventManager._instance = this;
    }

    // 싱글톤 접근
    static sharedInstance() {
        return new EventManager();
    }

    /**
     * 
     * @param {*} subscriber 수신자 객체 (참조 동일성으로 식별)
     * @param {*} eventName 이벤트명 ("" = 모든 이벤트 와일드카드)
     * @param {*} sender 발행자 객체(null = 모든 발행자 와일드카드)
     * @param {*} handler 실행할 콜백
     * @param {*} emitterType 구독자가 원하는 큐 (우선권)
     * @returns 
     */
    add(subscriber, eventName, sender, handler, emitterType = 'async') {
        if (!subscriber || typeof handler !== 'function') return;
        this._subs.push({
            id: this._idSeq++,
            subscriber,
            eventName: eventName ?? "",
            sender: sender ?? null,
            handler,
            emitterType,
        });
    }

    /**
     * 현재 모든 등록 조건 출력 (디버깅용)
     */
    description() {
        if (!this._subs.length) return 'No subscribers registered.';
        return this._subs.map((r, i) => {
            const en = r.eventName === "" ? '""' : `"${r.eventName}"`;
            const sn = r.sender ? who(r.sender) : 'null';
            return `Subscriber#${i + 1}: event name = ${en}, sender = ${sn}, emitter = ${r.emitterType}`;
        }).join('\n');
    }

    postEvent(eventName, sender, userData = {}, postType = 'async', completed = false, delayMs = 0) {
        if (!eventName || !sender) return;

        const ev = new Event(eventName, sender, userData, completed);
        console.log(`\n[${new Date().toLocaleTimeString()}] Post: ${ev.toString()} (postType=${postType}, delay=${delayMs}ms)`);

        // 매칭 규칙:
        // - eventName: "" 이면 모든이벤트 매칭
        // - sender : null 이면 모든 발행자 매칭
        const targets = this._subs.filter(r => {
            const okName = (r.eventName === "" || r.eventName === eventName);
            const okSender = (r.sender === null || r.sender === sender);
            return okName && okSender;
        });

        if (!targets.length) {
            console.log(`No subscribers for "${eventName}" from ${who(sender)}`);
            return;
        }

        // 구독자 큐 우선 -> 없으면 postType
        for (const reg of targets) {
            const q = reg.emitterType || postType;

            if (q === 'sync') {
                console.log(`[${new Date().toLocaleTimeString()}] Handle via sync -> ${who(reg.subscriber)}`);
                reg.handler(ev, ev.completed);
            } else if (q === 'async') {
                console.log(`[${new Date().toLocaleTimeString()}] Schedule via async -> ${who(reg.subscriber)}`);
                setImmediate(() => this._emitters.async.emit(RUN, { reg, ev }));
            } else if (q === 'delay') {
                const ms = Math.max(0, Number(delayMs) || 0);
                console.log(
                    `[${new Date().toLocaleTimeString()}] Schedule via delay(${ms}ms) -> ${who(reg.subscriber)}`
                );
                setTimeout(() => this._emitters.delay.emit(RUN, { reg, ev }), ms);
            } else {
                setImmediate(() => this._emitters.async.emit(RUN, { reg, ev }));
            }
        }
    }

    // 요구 메서드 포맷: 래퍼 3종
    postSync(eventName, sender, userData = {}, completed = false) {
        return this.postEvent(eventName, sender, userData, 'sync', completed, 0);
    }
    postAsync(eventName, sender, userData = {}, completed = false) {
        return this.postEvent(eventName, sender, userData, 'async', completed, 0);
    }
    postDelay(eventName, sender, userData = {}, delayMs = 0, completed = false) {
        return this.postEvent(eventName, sender, userData, 'delay', completed, delayMs);
    }
}