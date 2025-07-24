import { Worker } from 'node:worker_threads';

// 스레드 생성
const worker = new Worker(
    new URL('./worker.js', import.meta.url),
    { workerData: { greeting: '안녕, Worker!' } }   // 생성 시 데이터 전달
);

worker.once('online', () => {
    console.log('[main] worker 가 online 상태입니다');
})

// 스레드 멈충 (중간 취소)
// setTimeout(() => {
//     console.log('[main] 3초 지남 -> worker.terminate() 호출')
//     worker.terminate().then(code =>
//         console.log(`[main] 종료 완료, exitCode=${code}`)
//     );
// }, 3000);


// 외부 -> 내부 데이터 전달
worker.postMessage({ cmd: 'double', value: 21 });


// 내부 -> 외부 데이터 수신
// postMessage 는 구조적 복사(깊은 복사) 로 객체를 복제해 전달한다
worker.on('message', msg =>
    console.log(`[main] from worker: `, msg)
);

// 공동 데이터 읽기/쓰기
const shared = new SharedArrayBuffer(4); // 4byte = Int32 한칸
const counter = new Int32Array(shared);

const sharedWorker = new Worker(
    new URL('./worker.js', import.meta.url),
    { workerData: { shared } }
);

for (let i = 0; i < 1000; i++) {
    Atomics.add(counter, 0, 1)
}
console.log(`[main] after add: `, Atomics.load(counter, 0));

// 스레드 대기 + IPC
Atomics.store(counter, 0, 1);   // 초기값 1
setTimeout(() => {
    // counter[0] 의 값을 0으로 저장
    Atomics.store(counter, 0, 0);
    // counter[0] 의 조건으로 잠든 스레드를 최대 1개 깨움
    Atomics.notify(counter, 0, 1);  // 잠자는 worker 깨우기
}, 2000);

// 스레드 종료 정상
worker.postMessage('quit');
worker.once('exit', code =>
    console.log(`[main] worker exited (code=${code})`));