import { EventManager } from './ch9_eventManager.js';

const M = EventManager.sharedInstance();

// 설명 가능한 Publisher/Subscriber 객체들
const albumModel = { description: () => 'albumModel' };
const albumItemView = { description: () => 'albumItemView' };
const albumController = { description: () => 'albumController' };
const dummy = { description: () => 'dummy' };

const A = { description: () => 'subscriberA' };
const B = { description: () => 'subscriberB' };
const C = { description: () => 'subscriberC' };
const D = { description: () => 'subscriberD' };

// 구독 등록(구독자가 emitter 지정)
M.add(A, "ModelDataChanged", albumModel, (e, completed) => {
    console.log('A:', e.toString());
}, 'async');

M.add(B, "", albumItemView, (e, completed) => {
    console.log('B:', e.toString());
}, 'sync');

M.add(C, "DidShakeMotion", albumController, (e, completed) => {
    console.log('C1:', e.toString());
}, 'async');

M.add(C, "AllDataChanged", null, (e, completed) => {
    console.log('C2:', e.toString());
}, 'async');

M.add(D, "", null, (e, completed) => {
    console.log('D:', e.toString());
}, 'async');

// 등록 요약
console.log('\n-- subscribers --\n' + M.description());

// 발행 시나리오
M.postSync("ModelDataChanged", albumModel, { data: "abc" }, false);               // 동기
M.postSync("viewUpdated", albumItemView, { view: "xxx" }, false);                  // 동기
M.postAsync("DidShakeMotion", albumController, { from: "blue" }, false);           // 비동기(진행중)
M.postAsync("DidShakeMotion", albumController, { from: "blue" }, true);            // 비동기(완료)
M.postDelay("AllDataChanged", dummy, {}, 10_000, false);                            // 10초 지연

// 비동기/지연 확인 대기
setTimeout(() => console.log('[main] done'), 11_000);
