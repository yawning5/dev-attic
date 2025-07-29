import bus from './bus.js';
import um from './um.js';              
import { transCoders, verifiers } from './registry.js';

// ===== [Looper] =====
export default class Looper {
    static #inst;
    #timer

    constructor() {
        Looper.#inst = this;

        // ===== [이벤트 구독] =====
        // 주기적으로 큐 상태 확인
        bus.on('module:ready', () => {
            this.#timer = setInterval(() => this.tick(), 500);
        })
        // 완료 이벤트가 오면 즉시 한 번 더 tick
        bus.on('endConvert', () => {
            this.tick()
        });
        bus.on('endVerify', () => {
            this.tick()
        });
    }

    tick() {
        const q = um.getWQ();

        /* ─ 변환 슬롯 확인 ─ */
        while (transCoders.some(t => !t.isBusy()) &&
            q.some(f => f.state === '대기중')) {
            bus.emit('startConvert', q);   // 빈 모듈마다 한 번씩
        }

        /* ─ 검증 슬롯 확인 ─ */
        while (verifiers.some(v => !v.isBusy()) &&
            q.some(f => f.state === '검증대기중')) {
            bus.emit('startVerify', q);
        }

        /* ─ 전부 끝났나? ─ */
        if (q.length && q.every(f => f.state === '공개중')) {
            console.log('모든 영상 공개했습니다.');
            clearInterval(this.#timer);   // 원한다면 루프 종료
        }
    }
}
