import { transCoders, verifiers } from './registry.js';
import { Transcoder } from './Transcoder.js';
import { Verifier } from './Verifier.js';

// ===== [모듈 팩토리] =====
export class ModuleFactory {

    constructor(bus) {
        this.bus = bus;

        // ===== [이벤트 구독] =====
        bus.on('create:module', (recipe) => {
            const [trCnt, vrCnt] = recipe.map(Number);

            // 변환 모듈 만들기
            for (let i = 0; i < trCnt; i++) {
                transCoders.push(new Transcoder(bus)); // id 는 배열 index
            }
            // 검증 모듈 만들기
            for (let i = 0; i < vrCnt; i++) {
                verifiers.push(new Verifier(bus));
            }
            console.log(`서버별 현재 변환 모듈은 ${trCnt}개, 검증 모듈은 ${vrCnt}개입니다.`);
            bus.emit('module:ready');
        });
    }
}
