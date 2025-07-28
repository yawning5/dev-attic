import { EventEmitter } from 'events';
import readline from 'node:readline';

// ===== [헬퍼 함수] =====
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function typeToStr(type) {
    switch (type) {
        case '1':
            return '단편'
        case '2':
            return '중편'
        case '3':
            return '장편'
    }
}

// ===== [파일 관련] =====
const FILE = (type, state = '대기중') => {

    let convertSec;
    switch (type) {
        case `1`: convertSec = 3; break;     // 단편 3분
        case `2`: convertSec = 7; break;     // 중편 7분
        case `3`: convertSec = 15; break;    // 장편 15분
        default: throw new Error(`type 에 맞는 시간 없음`)
    }

    return {
        type,
        state,
        convertSec,
    };
}

const bus = new EventEmitter();

// ===== [업로드 매니저] =====
class UploadManager {
    #waitQueue

    static #instance

    constructor(bus) {
        if (UploadManager.#instance) return UploadManager.#instance;
        UploadManager.#instance = this;
        this.#waitQueue = [];
        this.bus = bus;

        // ===== [이벤트 구독] =====
        this.bus.on('addWaitQueue', (files) => {
            this.addWQ(files);
        })
        this.bus.on('endConvert', () => {
            if (this.#waitQueue.find(n => n.state === '대기중')) {
                bus.emit('startConvert', this.#waitQueue);
            }
            bus.emit('startVerify', this.#waitQueue)
        });
        this.bus.on('endVerify', () => {
            if (this.#waitQueue.filter(n => n.state != '공개중').length == 0) {
                console.log("모든 영상 공개했습니다.")
            }
            bus.emit('startVerify', this.#waitQueue);
        })
    }

    getWQ() {
        return this.#waitQueue;
    }

    addWQ(files) {
        for (const file of files) {
            this.#waitQueue.push(file);
        }
        bus.emit('printQueue', this.#waitQueue);
        bus.emit('startConvert', this.#waitQueue);
    }
}

const um = new UploadManager(bus);

// ===== [변환 모듈] =====
class Transcoder {

    #busy = false;

    constructor(bus) {
        this.bus = bus;

        // ===== [이벤트 구독] =====
        this.bus.on('startConvert', (queue) => {
            this.convert(queue);
        })
    }

    async convert(queue) {
        if (this.#busy) return;
        const file = queue.find(n => n.state === '대기중');
        if (!file) return;

        this.#busy = true;
        file.state = '변환중'
        console.log(`${typeToStr(file.type)} 변환 시작\n`);
        bus.emit('printQueue', queue);

        for (let i = 1; i <= file.convertSec; i++) {
            console.log(`${'.'.repeat(i)}${i}분경과`);
            await sleep(1000); // 실제는 1초(=1분)
        }

        file.state = '검증대기중'
        this.#busy = false;

        bus.emit('endConvert');
    }
}

const transCoder = new Transcoder(bus);

// ===== [검증 모듈] =====
class Verifier {
    #busy = false;
    constructor(bus) {
        this.bus = bus;

        // ===== [이벤트 구독] =====
        this.bus.on('startVerify', (queue) => {
            this.verify(queue);
        })
    }

    async verify(queue) {
        const file = queue.find(n => n.state === '검증대기중')
        if (this.#busy) {
            console.log(`${typeToStr(file.type)} 검증 대기`)
        }
        if (!file) {
            return;
        }

        this.#busy = true;
        file.state = '검증중'
        console.log(`${typeToStr(file.type)} 검증 시작`)
        bus.emit('printQueue', queue);
        for (let i = 1; i <= 10; i++) {
            console.log(`${'.'.repeat(i)}${i}분경과`);
            await sleep(1000); // 실제는 1초(=1분)
        }

        file.state = '공개중';
        console.log(`${typeToStr(file.type)} 검증 완료 -> 공개중`)
        this.#busy = false;

        bus.emit('endVerify');
    }
}

const verifier = new Verifier(bus);

// ===== [대시보드] =====
class DashBoard {
    constructor(bus, um) {
        this.bus = bus;
        this.um = um;

        // ===== [이벤트 구독] =====
        this.bus.on('printQueue', (queue) => {
            this.printQueue(queue);
        })
        this.bus.on('printStartConvert', (queue) => {
            console.log(`단편 변환 시작\n`)
            this.printQueue(queue);
        })
    }

    /**
     * 포맷 (:1) 대기중/~/
     * @param {*} queue waitQueue 를 받습니다
     */
    printQueue(queue) {
        const cur = queue.filter(n =>
            n.state === '변환중'
        );

        const curLog = cur.length > 0 ? `:${cur.map(f => f.type).join(',')} ` : '';

        const waitQ = queue.filter(n =>
            n.state === '대기중'
        )
        const waitQTypes = waitQ.map(n => n.type);
        console.log(waitQTypes)
        console.log(`${curLog}대기중/${waitQTypes.join(',')}/`)
    }
}

const dashBoard = new DashBoard(bus, um);

// ===== [콘솔 관련] =====
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('영상 업로드  =  1. 단편(3분)    2. 중편(7분)    3. 장편(15분)\n업로드할 영상을 입력하세요. 예) 단편 2개 => 1:2');
rl.prompt();

rl.on('line', (answer) => {
    const [type, Num] = answer.split(':');
    const files = [];
    for (let i = 0; i < Num; i++) {
        const file = FILE(type);
        files.push(file);
    }
    rl.prompt();
    bus.emit('addWaitQueue', files);
});