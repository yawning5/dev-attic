import bus from './bus.js';
import { verifiers } from './registry.js';
import { typeToStr, sleep } from './util.js';
import dashBoard from './DashBoard.js';

// ===== [검증 모듈] =====
export class Verifier {
    #busy = false;

    constructor(bus) {
        this.bus = bus;

        // ===== [이벤트 구독] =====
        this.bus.on('startVerify', (queue) => {
            this.verify(queue);
        });
    }

    isBusy() {
        return this.#busy;
    }

    getId() {
        return verifiers.indexOf(this);
    }

    async verify(queue) {
        const file = queue.find(n => n.state === '검증대기중');
        if (!file) {
            return;
        }
        if (this.#busy) {
            console.log(`${typeToStr(file.type)} 검증 대기`);
            return;
        }


        this.#busy = true;
        file.state = '검증중';
        console.log(`${typeToStr(file.type)} 검증 시작`);
        bus.emit('printQueue', queue);
        for (let i = 1; i <= 10; i++) {
            console.log(`${'.'.repeat(i)}${i}분경과`);
            await sleep(1000); // 실제는 1초(=1분)
        }

        file.state = '공개중';
        console.log(`${typeToStr(file.type)} 검증 완료 -> 공개중`);
        this.#busy = false;

        bus.emit('endVerify');
    }
}
