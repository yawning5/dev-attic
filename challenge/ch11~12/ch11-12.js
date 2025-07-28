import { EventEmitter } from 'events';
import readline from 'node:readline';

// ===== [파일 관련] =====
const FILE = (type, state = '대기') => ({
    type,
    state
})

class EventManager extends EventEmitter {

    static #instance;

    constructor() {
        super();
        if (EventManager.#instance) return EventManager.#instance;
        EventManager.#instance = this;
    }

    addQueue(files) {
        this.emit('addQueue', files)
    }
}

const em = new EventManager();

// ===== [업로드 매니저] =====
class UploadManager {
    #Queue
    static #instance

    constructor() {
        if (UploadManager.#instance) return UploadManager.#instance;
        UploadManager.#instance = this;
        this.#Queue = [];
    }

    getQ() {
        return this.#Queue;
    }

    add(files) {
        for (const file of files) {
            this.#Queue.push(file);
        }
    }
}

const um = new UploadManager();

// ===== [대시보드] =====
class DashBoard {
    constructor() {

    }

    printQueue(queue) {
        const waitQ = queue.filter(n =>
            n.state === '대기'
        )
        const waitQTypes = waitQ.map(n => n.type);
        console.log(waitQTypes)
        console.log(`대기중/${waitQTypes.join(',')}/`)
    }
}

const dashBoard = new DashBoard();

// ===== [이벤트 구독] =====
em.on('addQueue', (files) => {
    um.add(files);
    dashBoard.printQueue(um.getQ());
})


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
            em.addQueue(files);
            
            rl.prompt();
        }
    )
}

// ===== [구동부] =====
askFile();