import { EventEmitter } from 'events';
import readline from 'node:readline';

// ===== [헬퍼] =====
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

const transCoders = [];
const verifiers = [];

// ===== [파일] =====
const FILE = (type, state = '대기중', user, transCoderId = 0) => {

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
        user,
        transCoderId
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
    }

    getWQ() {
        return this.#waitQueue;
    }

    addWQ(files) {
        for (const file of files) {
            this.#waitQueue.push(file);
        }
        bus.emit('printQueue', this.#waitQueue);
    }
}

const um = new UploadManager(bus);

// ===== [변환 모듈] =====
class Transcoder {

    workSlot = [];
    #busy = false;
    #cap = 2;

    constructor(bus) {
        this.bus = bus;

        // ===== [이벤트 구독] =====
        this.bus.on('startConvert', (queue) => {
            this.convert(queue);
        })
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
        file.state = '변환중'
        console.log(`${typeToStr(file.type)} 변환 시작\n`);
        bus.emit('printQueue', queue);

        for (let i = 1; i <= file.convertSec; i++) {
            console.log(`${'.'.repeat(i)}${i}분경과`);
            await sleep(1000); // 실제는 1초(=1분)
        }

        file.state = '검증대기중'
        file.transCoderId = 0;
        this.#busy = false;

        bus.emit('endConvert');
    }
}


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

    isBusy() {
        return this.#busy;
    }

    getId() {
        return verifiers.indexOf(this);
    }

    async verify(queue) {
        const file = queue.find(n => n.state === '검증대기중')
        if (this.#busy) {
            console.log(`${typeToStr(file.type)} 검증 대기`)
            return;
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
        const grouped = queue.reduce(
            (acc, f) => {
                acc[f.state].push(f.type);
                return acc;
            },
            {
                '변환중': [],   // cur
                '대기중': [],   // 변환 대기
                '검증대기중': [],   // 검증 대기
                '검증중': [],    // verifying
                '공개중': []
            }
        );

        console.log(`변환중:${grouped['변환중'].join(',')} 변환대기/${grouped['대기중'].join(',')}/ 검증대기/${grouped['검증대기중'].join(',')}/ 검증중/${grouped['검증중'].join(',')}/`)
    }
}

const dashBoard = new DashBoard(bus, um);

// ===== [모듈 팩토리] =====
class ModuleFactory {

    constructor(bus) {
        this.bus = bus

        // ===== [이벤트 구독] =====
        bus.on('create:module', (recipe) => {
            const [trCnt, vrCnt] = recipe.map(Number)

            // 변환 모듈 만들기
            for (let i = 0; i < trCnt; i++) {
                transCoders.push(new Transcoder(bus));     // id 는 배열 index
            }
            // 검증 모듈 만들기
            for (let i = 0; i < vrCnt; i++) {
                verifiers.push(new Verifier(bus));
            }
            console.log(`서버별 현재 변환 모듈은 ${trCnt}개, 검증 모듈은 ${vrCnt}개입니다.`);
            bus.emit('module:ready');
        })
    }
}

new ModuleFactory(bus);

// ===== [Looper] =====
class Looper {
    static #inst;
    #timer

    constructor(bus, um,) {
        Looper.#inst = this;
        this.bus = bus;
        this.um = um;

        // ===== [이벤트 구독] =====
        // 주기적으로 큐 상태 확인
        this.bus.on('module:ready', () => {
            this.#timer = setInterval(() => this.tick(), 500);
        })
        // 완료 이벤트가 오면 즉시 한 번 더 tick
        this.bus.on('endConvert', () => {
            this.tick()
        });
        this.bus.on('endVerify', () => {
            this.tick()
        });
    }

    tick() {
        const q = this.um.getWQ();

        /* ─ 변환 슬롯 확인 ─ */
        while (transCoders.some(t => !t.isBusy()) &&
            q.some(f => f.state === '대기중')) {
            this.bus.emit('startConvert', q);   // 빈 모듈마다 한 번씩
        }

        /* ─ 검증 슬롯 확인 ─ */
        while (verifiers.some(v => !v.isBusy()) &&
            q.some(f => f.state === '검증대기중')) {
            this.bus.emit('startVerify', q);
        }

        /* ─ 전부 끝났나? ─ */
        if (q.length && q.every(f => f.state === '공개중')) {
            console.log('모든 영상 공개했습니다.');
            clearInterval(this.#timer);   // 원한다면 루프 종료
        }
    }
}

new Looper(bus, um)

// ===== [콘솔 관련] =====
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askModule() {
    rl.question('모듈 갯수 입력 변환 모듈 갯수:검증 모듈 갯수 ex 3:4', (answer) => {
        const recipe = answer.split(':');
        bus.emit('create:module', recipe);
    })
}

askModule();
console.log('영상 업로드  =  1. 단편(3분)    2. 중편(7분)    3. 장편(15분)\n업로드할 영상을 입력하세요. 예) 단편 2개 => 1:2');
rl.prompt();

rl.on('line', (answer) => {

    const files = [];

    const user_files = answer
        .split(',')
        .map(n => n.trim());

    const fileList = user_files.slice(1);

    for (const file of fileList) {
        const [type, Num] = file.split(':');

        for (let i = 0; i < Num; i++) {
            const file = FILE(type);
            files.push(file);
        }
    }
    rl.prompt();
    bus.emit('addWaitQueue', files);
});