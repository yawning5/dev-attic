// const protocol = {
//     INVITED: makeHandler(
//         function (ev) {
//             if (ev === 404) return 'INVITED-404 동작';
//             return 'INVITED 기본';
//         },
//         {
//             EVENT(ev) {
//                 return ev === 432 ? '특정 동작' : 'EVENT 기본';
//             }
//         }
//     ),

//     ACCEPTED: makeHandler(
//         function (ev) { return `ACCEPTED 기본-${ev}`; },
//         {
//             CONFIRM() { return '확인됨'; }
//         }
//     )
// };

// function makeHandler(defaultFn, extraMethods = {}) {
//     const fn = defaultFn;         // ① 기본 동작용 함수
//     Object.assign(fn, extraMethods); // ② 함수 객체에 서브 메서드 복사
//     return fn;                    // ③ 완성된 함수 객체 반환
// }

// console.log(protocol['INVITED']['EVENT'](432))
// console.log(protocol['INVITED'](432))
// console.log(protocol['INVITED'](432))
// console.log(protocol['INVITED'](404))
const STATE = Object.freeze({
    IDLE: 'IDLE',
    INVITED: 'INVITED',
    AUTH_REQUESTED: 'AUTH REQUESTED',
    REDIRECTING: 'REDIRECTING',
    REDIRECTED: 'REDIRECTED',
    CANCELLING: 'CANCELLING',
    CANCELLED: 'CANCELLED',
    ACCEPTED: 'ACCEPTED',
    ESTABLISHED: 'ESTABLISHED',
    CLOSING: 'CLOSING',
    FAILED: 'FAILED',
    TERMINATED: 'TERMINATED'
});

const EVENT = Object.freeze({
    INVITE: 'INVITE',
    CANCEL: 'CANCEL',
    ACK: 'ACK',
    BYE: 'BYE',
    TIMEOUT: '<timeout>',
    C_200: '200',
    C_200_CANCEL: '200(CANCEL)',
    C_200_BYE: '200(BYE)',
    C_407: '407',
    C_487: '487',
    C_1XX: '1xx',
    C_3XX: '3xx',
    C_4XX_6XX: '4xx-6xx'
});

const TRANSITIONS = [
    { from: STATE.IDLE, to: STATE.INVITED, event: EVENT.INVITE },

    { from: STATE.INVITED, to: STATE.INVITED, event: EVENT.C_1XX },
    { from: STATE.INVITED, to: STATE.ACCEPTED, event: EVENT.C_200 },
    { from: STATE.INVITED, to: STATE.CANCELLING, event: EVENT.CANCEL },
    { from: STATE.INVITED, to: STATE.AUTH_REQUESTED, event: EVENT.C_407 },
    { from: STATE.INVITED, to: STATE.REDIRECTING, event: EVENT.C_3XX },
    { from: STATE.INVITED, to: STATE.FAILED, event: EVENT.C_4XX_6XX },

    { from: STATE.AUTH_REQUESTED, to: STATE.INVITED, event: EVENT.ACK },

    { from: STATE.REDIRECTING, to: STATE.REDIRECTED, event: EVENT.ACK },
    { from: STATE.REDIRECTED, to: STATE.INVITED, event: EVENT.INVITE },
    { from: STATE.REDIRECTED, to: STATE.TERMINATED, event: EVENT.TIMEOUT },

    { from: STATE.CANCELLING, to: STATE.CANCELLED, event: EVENT.C_200_CANCEL },
    { from: STATE.CANCELLED, to: STATE.TERMINATED, event: EVENT.C_487 },

    { from: STATE.ACCEPTED, to: STATE.CANCELLING, event: EVENT.CANCEL },
    { from: STATE.ACCEPTED, to: STATE.ESTABLISHED, event: EVENT.ACK },
    { from: STATE.ESTABLISHED, to: STATE.CLOSING, event: EVENT.BYE },
    { from: STATE.CLOSING, to: STATE.TERMINATED, event: EVENT.C_200_BYE },
    { from: STATE.CLOSING, to: STATE.CLOSING, event: EVENT.BYE },


    { from: STATE.FAILED, to: STATE.TERMINATED, event: EVENT.ACK }
];

const stateMap = (() => {
    const m = new Map();

    for (const { from, to, event } of TRANSITIONS) {
        if (!m.has(from)) {
            m.set(from, new Map());
        }
        m.get(from).set(event, to);
    }

    return m;
})();

/**
 * 외부에서 받은 문자열을 EVENT 상수로 변환한다
 * @param {string} raw - 이벤트값
 * @returns {string} - 매핑된 EVENT 상수 또는 원본 문자열
 */
function normalizeEvent(raw) {
    if (EVENT[raw]) return EVENT[raw];

    if (/^\d{3}$/.test(raw)) {
        const n = Number(raw);
        if (n === 200) return EVENT.C_200;
        if (n === 407) return EVENT.C_407;
        if (n === 487) return EVENT.C_487;
        if (n >= 100 && n <= 199) return EVENT.C_1XX;
        if (n >= 300 && n <= 399) return EVENT.C_3XX;
        if (n >= 400 && n <= 699) return EVENT.C_4XX_6XX;
    }

    if (raw === '200(CANCEL)') return EVENT.C_200_CANCEL;
    if (raw === '200(BYE)') return EVENT.C_200_BYE;

    return raw;
}

/**
 * stateMap 에서 각 키에 맞는 값을 꺼냄
 * @param {string} from - 현재 상태값
 * @param {string} rawEv - 원본 이벤트 문자열
 * @returns - 
 */
function move(from, rawEv) {
    const ev = normalizeEvent(rawEv);
    return stateMap.get(from).get(ev);
}

/**
 * 이벤트 진행후에도 원래 상태가 나오면 중복기록하지 않고
 * 상태가 바뀔때만 기록합니다
 * @param {Array} param0 - 원본 이벤트 문자열이 담긴 배열 
 * @param {Array} track - 지나간 상태를 기록할 배열
 */
function dupCheck(param0, track) {
    for (e of param0) {
        const curState = track.pop();
        const nextState = move(curState, e);
        if (curState === nextState) {
            track.push(nextState);
        } else {
            track.push(curState);
            track.push(nextState);
        }
    }
}

// ------ 작동 부분 -------
function next(param0) {
    const track = ['IDLE'];

    dupCheck(param0, track);

    track.shift();

    return track;
}

const param0 =  ["INVITE", "180", "200", "ACK", "BYE", "200(BYE)"]
const result = next(param0);

console.log(result);

