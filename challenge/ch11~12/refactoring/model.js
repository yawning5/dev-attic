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

export default FILE;