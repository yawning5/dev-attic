// function nextPosition(current, dice) {
//     const next = current + dice;
//     if (next == 4) {
//         return dice + 10;
//     }
//     else if (next == 8) {
//         return dice + 22;
//     }
//     else if (next == 28) {
//         return dice + 48;
//     }
//     else if (next == 21) { // 코드 순서는 상관이 없다 == 이기 때문
//         // return dice + 42; // 42 인 칸으로 가야하는데 + 42
//         return dice + 21;
//     }
//     else if (next == 50) {
//         return dice + 17;
//     }
//     else if (next == 71) {
//         // return dice + 92; // 92 인 칸으로 가야하는데 + 92
//         return dice + 21;
//     }
//     else if (next == 80) {
//         return dice + 19;
//     }


//     return -1;
// }

function Snake(temp) {
    // 추가 규칙 뱀들
    // if (temp == 32) {
    //     return 10;
    // }
    // else if (temp == 36) {
    //     return 6;
    // }
    // else if (temp == 48) {
    //     return 26;
    // }
    // else if (temp == 62) {
    //     return 18;
    // }
    // else if (temp == 88) {
    //     return 24
    // }
    // else if (temp == 95) {
    //     return 56;
    // }
    // else if (temp == 97) {
    //     return 78;
    // }

    const snakeMap = {
        32: 10,
        36: 6,
        48: 26,
        62: 18,
        88: 24,
        95: 56,
        97: 78
    }

    if (snakeMap.hasOwnProperty(temp)) {
        console.log(`뱀에 물림 ${temp} => ${snakeMap[temp]}`);
        return snakeMap[temp];
    }

    return -1;
}

function Ladder(temp) {
    // if (temp == 4) {
    //     return 14;
    // }
    // else if (temp == 8) {
    //     return 30;
    // }
    // else if (temp == 28) {
    //     return 76;
    // }
    // else if (temp == 21) {
    //     return 42;
    // }
    // else if (temp == 50) {
    //     return 67;
    // }
    // else if (temp == 71) {
    //     return 92;
    // }
    // else if (temp == 80) {
    //     return 99;
    // }
    const ladderMap = {
        4: 14,
        8: 30,
        21: 42,
        28: 76,
        50: 67,
        71: 92,
        80: 99
    }

    if (ladderMap.hasOwnProperty(temp)) {
        console.log(`사다리 당첨 ${temp} => ${ladderMap[temp]}`);
        return ladderMap[temp];
    }

    return -1;
}

function nextPosition(current, dice) {
    const temp = current + dice;
    const ladderTemp = Ladder(temp);
    const snakeTemp = Snake(temp);

    // // 함수를 2번 호출해서 로그가 2번 찍히는 것을 확인하고 변수로 변환
    // if (Ladder(temp) != -1) {
    //     return Ladder(temp)
    // } else if (Snake(temp) != -1) {
    //     return Snake(temp);
    // }

    if (ladderTemp != -1) {
        return ladderTemp;
    } else if (snakeTemp != -1) {
        return snakeTemp;
    }
    
    return temp;
}




let start = 1;
let next = 1;
let dice = 3;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = next;
dice = 4;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = next;
dice = 3;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = next;
dice = 5;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = next;
dice = 1;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 20;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 70;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 31;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 35;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 47;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 61;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 87;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 94;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = 1;
dice = 96;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);
