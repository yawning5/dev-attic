import { EventEmitter } from 'events';
import readline from 'node:readline';

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
    #convertingQueue
    #preVerifyQueue
    #verifyingQueue

    static #instance

    constructor(bus) {
        if (UploadManager.#instance) return UploadManager.#instance;
        UploadManager.#instance = this;
        this.#waitQueue = [];
        this.#convertingQueue = [];
        this.#preVerifyQueue = [];
        this.#verifyingQueue = [];
        this.bus = bus;

        this.bus.on('addWaitQueue', (files) => {
            this.add(files);
        })
    }

    getWQ() {
        return this.#waitQueue;
    }

    add(files) {
        for (const file of files) {
            this.#waitQueue.push(file);
        }
        bus.emit('printQueue', this.#waitQueue);
    }
}

const um = new UploadManager(bus);

// ===== [변환 모듈] =====
class Transcoder {
    #busy = false;
    constructor(bus) {
        this.bus = bus;
    }

    async convert(file) {
        if (this.#busy) {
            const err = new Error('점유중');
            console.error(err.stack);
            throw err;
        }
        this.#busy = true;
        file.state = '변환중'
        bus.startConvert(file)

        await sleep(file.convertSec);
        file.state('검증중')
        bus.endConvert(file);

        this.#busy = false;
    }
}

// ===== [대시보드] =====
class DashBoard {
    constructor(bus, um) {
        this.bus = bus;
        this.um = um;

        this.bus.on('printQueue', (queue) => {
            this.printQueue(queue);
        })
    }

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

    convertStart() {
        
    }
}

const dashBoard = new DashBoard(bus, um);

// ===== [콘솔 관련] =====
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askFile() {
    rl.question('영상 업로드  =  1. 단편(3분)    2. 중편(7분)    3. 장편(15분)\n업로드할 영상을 입력하세요. 예) 단편 2개 => 1:2\n'
        , (answer) => {
            const [type, Num] = answer.split(':');
            const files = [];

            for (let i = 0; i < Num; i++) {
                // 여기서 큐 등록 이벤트 발생
                const file = FILE(type);
                files.push(file);
            }
            bus.emit('addWaitQueue', files);

            rl.prompt();
        }
    )
}

// ===== [구동부] =====
askFile();