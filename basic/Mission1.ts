function nextPosition(current, dice) {
    const next = current + dice;
    if (next == 4) {
        return dice + 10;
    }
    else if (next == 8) {
        return dice + 22;
    }
    else if (next == 28) {
        return dice + 48;
    }
    else if (next == 21) { // 코드 순서는 상관이 없다 == 이기 때문
        // return dice + 42; // 42 인 칸으로 가야하는데 + 42
        return dice + 21;
    }
    else if (next == 50) {
        return dice + 17;
    }
    else if (next == 71) {
        // return dice + 92; // 92 인 칸으로 가야하는데 + 92
        return dice + 21;
    }
    else if (next == 80) {
        return dice + 19;
    }
    // 추가 규칙 뱀들
    else if (next == 32) {
        return dice - 22;
    }
    else if (next == 36) {
        return dice - 30;
    }
    else if (next == 48) {
        return dice - 22;
    }
    else if (next == 62) {
        return dice -44;
    }
    else if (next == 88) {
        return dice - 64
    }
    else if (next == 95) {
        return dice - 39;
    }
    else if (next == 97) {
        return dice - 19;
    }
    
    return dice;    
}

let start = 1;
let next = 1;
let dice = 3;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = next;
dice = 4;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = next;
dice = 3;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = next;
dice = 5;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = next;
dice = 1;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice = 20;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice =  70;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice =  31;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice =  35;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice =  47;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice =  61;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice =  87;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice =  94;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = 1;
dice =  96;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);
