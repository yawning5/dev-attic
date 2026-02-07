import bus from "./bus.js";

class DashBoard {
    constructor() {

        // ===== [이벤트 구독] =====
        bus.on('printQueue', (queue) => {
            this.printQueue(queue);
        })
        bus.on('printStartConvert', (queue) => {
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

const dashBoard = new DashBoard();
export default dashBoard;