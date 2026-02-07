function play(param0) {

    // const table = [
    //     [80, 0],
    //     [50, 0],
    //     [30, 0],
    //     [10, 0],
    // ];
    // 테이블에 이미 놓여진 카드도 1개로 취급한다

    // Array
    const table = [
        [80, 1],
        [50, 1],
        [30, 1],
        [10, 1],
    ]

    // Map
    const score = new Map([
        ["A", 0],
        ["B", 0],
        ["C", 0]
    ]);

    if (param0.length % 3 != 0) {
        console.log("3의 배수가 아닌 param0")
        return score;
    }

    // 카드게임
    for (let i = 0; i + 2 < param0.length; i += 3) {

        // // size 는 Map 이나 Set 전용, Array 는 length 사용 됨
        // // if (table.size === 0) {
        if (table.length === 0) {
            // return [...score].map(([key, value]) => [key, value.toString()]);
            // 2차원 배열 반환
            console.log("테이블이 비어있습니다. 게임 종료.");
            return new Map(
                [...score].map(([key, value]) => [key, value.toString()])
            );
        }

        // table의 각 점수에 대해 sortedCards의 값을 비교하여 어느 table에 놓을지 파악
        // 각 table 점수 - sortedCards의 abs 값이 가장 작은 table의 값이 sortedCards 의 값보다 작으면 내려놓는다
        // 만약 table의 값이 sortedCards의 값보다 크면, 그 table은 빈 배열로 변하고 더 이상 놓을 수 없다.
        // (이 경우 score 는 놓여져있던 카드 갯수만큼 부과한다)
        // 동일값 발생시 가장 큰 table에 놓는다
        // 모든 배열이 비어있으면 게임이 끝난다

        const player = [
            [param0[i], 'A'],
            [param0[i + 1], 'B'],
            [param0[i + 2], 'C']
        ];

        player.sort((a, b) => a[0] - b[0]); // 오름차순 정렬

        // 플레이어의 카드가 정렬된 상태로 table에 놓을 준비
        for (let j = 0; j < player.length; j++) {

            const playerCard = player[j][0];
            const playerName = player[j][1];

            // 현재 플레이어의 카드와 table의 각 점수의 차이를 계산
            const diff = table.map(t => Math.abs(t[0] - playerCard));

            // 차이가 가장 작은 table의 인덱스를 찾는다 table 자체가 내림차순 정렬이라
            // 차이가 동일 하더라도 큰 수부터 놓을 수 있음
            const minDiffIndex = diff.indexOf(Math.min(...diff));

            // A, B, C 순서가 모두 돌지 않아도 table 에 놓을 수 있는 공간이 없으면 게임 종료
            if (minDiffIndex === -1 || table.length === 0) {
                console.log("테이블에 놓을 수 있는 공간이 없습니다.");
                return new Map(
                    [...score].map(([key, value]) => [key, value.toString()])
                );
            }

            // 만약 현재 플레이어의 카드가 table의 값보다 크거나 같으면 점수를 증가시킨뒤 삭제
            if (table[minDiffIndex][0] <= playerCard) {
                // 그리고 플레이어의 score를 table에 쌓인 카드 수 만큼 증가시킨다
                score.set(playerName,
                    score.get(playerName) + table[minDiffIndex][1]);

                table.splice(minDiffIndex, 1);
            } else {
                // 현재 카드가 table의 값보다 작거나 같으면, 해당 table에 카드를 놓는다
                table[minDiffIndex][1] += 1;
                table[minDiffIndex][0] = playerCard;
            }
        }
    }

    console.log("게임이 종료되었습니다.");
    return new Map(
        [...score].map(([key, value]) => [key, value.toString()])
    );
}


let param0;
let expect;
let result;

console.log("\ntestEven");
param0 = [19, 50, 77, 46, 65, 3, 1, 36, 47, 80, 30, 82, 1];
result = play(param0);
console.log("param0=", param0, ", \nresult=", result, "\ntestEven end");


console.log("\ntest0");
param0 = [19, 50, 77, 46, 65, 3, 1, 36, 47, 80, 30, 82];
result = play(param0);
console.log("param0=", param0, ", \nresult=", result, "\ntest0 end");


console.log("\ntest1");
param0 = [21, 9, 4];
expect = new Map([["A", '0'], ["B", '2'], ["C", '0']]);
result = play(param0);
console.log("param0=", param0, ", \nresult=", result, " \nexpect=", expect, "\ntest1 end");

console.log("\ntest2");
param0 = [55, 8, 29, 13, 7, 61];
expect = new Map([["A", '4'], ["B", '0'], ["C", '0']]);
result = play(param0);
console.log("param0=", param0, ", \nresult=", result, " \nexpect=", expect, "\ntest2 end");

console.log("\ntest3");
param0 = [90, 95, 100, 85, 87, 89, 88, 91, 93];
result = play(param0);
console.log("param0=", param0, ", \nresult=", result, "\ntest3 end");

// 데이터 입력/출력 부분
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputs = [];
rl.on('line', (line) => {
    inputs.push(line);
    if (inputs.length === 1) {
        rl.close();
    }
});

rl.on('close', () => {
    const numArray = inputs[0].split(',').map(Number);
    const answer = play(numArray);
    for (const [key, value] of answer) {
        console.log(key + "=" + value);
    }
    rl.close();
});