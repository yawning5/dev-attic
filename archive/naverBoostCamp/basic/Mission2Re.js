
function validateInput(arr) {
    return arr.length % 3 === 0;
}

function stringifyScore(scoreMap) {
    return new Map([...scoreMap].map(([k, v]) => [k, v.toString]));
}

function buildPlayers(chunk) {
    return [
        { card: chunk[0], name: 'A' },
        { card: chunk[1], name: 'B' },
        { card: chunk[2], name: 'C' },
    ].sort((a, b) => a.card - b.card);
}

function findClosestIndex(table, cardVal) {
    if (table.length === 0) return -1;
    let min = Infinity, idx = -1;
    table.forEach((t, i) => {
        const d = Math.abs(t[0] - cardVal);
        if (d < min) { min = d; idx = i; }
    });
    return idx;
}

function processTurn({ card, name }, table, score) {
    const idx = findClosestIndex(table, card);
    if (idx === -1) return false;

    if (table[idx][0] <= card) {
        score.set(name, score.get(name) + table[idx][1]);
        table.splice(idx, 1);
    } else {
        table[idx][0] = card;
        table[idx][1] += 1;
    }
    return true;
}

function play(param0) {
    const table = [
        [80, 1],
        [50, 1],
        [30, 1],
        [10, 1],
    ];

    const score = new Map([
        ["A", 0],
        ["B", 0],
        ["C", 0]
    ]);

    // if (param0.length % 3 != 0) {
    if (!validateInput(param0)) {
        console.log("3의 배수가 아닌 param0");
        // return new Map(
        //     [...score].map(([key, value]) => [key, value.toString()])
        // );
        return stringifyScore(score);
    }

    for (let i = 0; i + 2 < param0.length; i += 3) {
        if (table.length === 0) {
            console.log("테이블이 비어있습니다. 게임 종료.");
            // return new Map(
            //     [...score].map(([key, value]) => [key, value.toString()])
            // );
            return stringifyScore(score);
        }

        // const player = [
        //     [param0[i], 'A'],
        //     [param0[i + 1], 'B'],
        //     [param0[i + 2], 'C']
        // ];

        // player.sort((a, b) => a[0] - b[0]);
        const players = buildPlayers(param0.slice(i, i + 3));

        // for (let j = 0; j < player.length; j++) {
        //     const playerCard = player[j][0];
        //     const playerName = player[j][1];

        //     // const diff = table.map(t => Math.abs(t[0] - playerCard));
        //     // const minDiffIndex = diff.indexOf(Math.min(...diff));
        //     const minDiffIndex = findClosestIndex(table, playerCard);

        //     if (minDiffIndex === -1 || table.length === 0) {
        //         console.log("테이블에 놓을 수 있는 공간이 없습니다.");
        //         return stringifyScore(score);
        //     }

        //     if (table[minDiffIndex][0] <= playerCard) {
        //         score.set(playerName,
        //             score.get(playerName) + table[minDiffIndex][1]);
        //         table.splice(minDiffIndex, 1);
        //     } else {
        //         table[minDiffIndex][1] += 1;
        //         table[minDiffIndex][0] = playerCard;
        //     }
        // }

        for (const p of players) {
            if (!processTurn(p, table, score)) {
                console.log("테이블에 놓을 수 있는 공간이 없습니다.");
                return stringifyScore(score);
            }
            if (table.length === 0) {
                console.log("테이블이 비어있습니다. 게임 종료")
                return stringifyScore(score);
            }
        }
    }

    console.log("게임이 종료되었습니다.");
    // return new Map(
    //     [...score].map(([key, value]) => [key, value.toString()])
    // );
    return stringifyScore(score);
}