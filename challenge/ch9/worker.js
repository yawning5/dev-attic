import { parentPort, workerData, threadId } from 'node:worker_threads';

// 처음 받은 workerData 사용
console.log(`[worker${threadId}] ${workerData.greeting}`)


// 내부 -> 외부 데이터 전달
parentPort.on('message', ({ cmd, value }) => {
    if (cmd === 'double') {
        const result = value * 2;
        parentPort.postMessage({ result });
    }
});

// 공동 데이터 읽기/쓰기
if (workerData.shared) {
    const view = new Int32Array(workerData.shared);
    console.log(`[worker${threadId}] before:`, view[0]); // 감소 전 값
    for (let i = 0; i < 1000; i++) {
        Atomics.sub(view, 0, 1);
    }
    console.log(`[worker${threadId}] after:`, view[0]); // 감소 후 값
    parentPort.postMessage({ final: Atomics.load(view, 0) })
    setTimeout(() => process.exit(0), 20);
}

// 스레드 대기 + IPC
if (workerData.shared) {
    const view = new Int32Array(workerData.shared);
    console.log('[worker] waiting…');

    // 값이 1이 아니게 되면 깨어남
    // view[0] 이 1이면 대기(잠자기) - cpu 점유 x
    Atomics.wait(view, 0, 1);     // 기대값 1이 바뀔 때까지 대기
    console.log('[worker] woken! value:', Atomics.load(view, 0));
}

// 스레드 종료 정상
parentPort.on('message', msg => {
    if (msg === 'quit') {
        console.log('[worker] cleaning up…');
        parentPort.close();        // 채널 닫기
        process.exit(0);           // 정상 종료
    }
});