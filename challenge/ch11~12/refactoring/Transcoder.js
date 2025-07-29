import bus from './bus.js';
import { transCoders } from './registry.js';
import { typeToStr, sleep } from './util.js';
import dashBoard from './DashBoard.js';

// ===== [변환 모듈] =====
export class Transcoder {

    workSlot = [];
    #busy = false;
    #cap = 2;

    constructor(bus) {
        this.bus = bus;

        // ===== [이벤트 구독] =====
        this.bus.on('startConvert', (queue) => {
            this.convert(queue);
        });
    }

    #checkSlot() {
        if (this.workSlot.length >= this.#cap) {
            this.#busy = true;
        } else {
            this.#busy = false;
        }
    }

    getId() {
        return transCoders.indexOf(this);
    }

    isBusy() {
        return this.#busy;
    }

    async convert(queue) {
        if (this.#busy) return;
        const file = queue.find(n => n.state === '대기중');
        if (!file) return;

        const id = this.getId();
        file.transCoderId = id + 1;

        this.#busy = true;
        file.state = '변환중';
        console.log(`${typeToStr(file.type)} 변환 시작\n`);
        bus.emit('printQueue', queue);

        for (let i = 1; i <= file.convertSec; i++) {
            console.log(`${'.'.repeat(i)}${i}분경과`);
            await sleep(1000); // 실제는 1초(=1분)
        }

        file.state = '검증대기중';
        file.transCoderId = 0;
        this.#busy = false;

        bus.emit('endConvert');
    }
}
