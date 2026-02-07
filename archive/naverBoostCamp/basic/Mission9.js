
// 외곽 (시계방향) 노드 순서
const OUTER = [
    "Z",
    "ZW1", "ZW2", "ZW3", "ZW4", "W",
    "WX1", "WX2", "WX3", "WX4", "X",
    "XY1", "XY2", "XY3", "XY4", "Y",
    "YZ1", "YZ2", "YZ3", "YZ4", "Z"
];

// 기본 한 칸 그래프 
const nextDefault = new Map(
    OUTER.slice(0, -1)
        .map((n, i) => [n, OUTER[i + 1]])
);

// 대각선 내부 경로 추가 (분기 점을 통과 하는 경우)
[
    ["W", "WX1"], ["WV1", "WV2"], ["WV2", "V"],
    ["V", "VY1"],
    ["VY1", "VY2"], ["VY2", "Y"],
    ["VZ1", "VZ2"], ["VZ2", "Z"],
    ["X", "XY1"], ["XV1", "XV2"], ["XV2", "V"]
].forEach(([a, b]) => nextDefault.set(a, b));


// 분기점에서 짧은 길 우선 (정확히 멈춘 경우)
const shortBranch = new Map([
    ["W", "WV1"],          // W  → V (대각선)
    ["X", "XV1"],          // X  → V (대각선)
    ["V", "VZ1"]           // V  → Z (대각선)
]);

// 주사위 문자 → 이동 칸수 
const MOVE = Object.freeze({
    D: 1,
    K: 2,
    G: 3,
    U: 4,
    M: 5
});

// 위치 -> 출력 문자열 변환
function toLabel(pos) {
    if (pos === "Z") return "Z";

    // 큰 원 노드 (W, V, X, Y) 는 고정 라벨
    const fixed = { W: "ZW5", V: "WV3", X: "WX5", Y: "XY5" };
    if (fixed[pos]) return fixed[pos];

    // 출발+도착+번호 형태면 그대로 사용
    return /^[A-Z]{2}\d$/.test(pos) ? pos : "ERR";
}

// 한 플레이어 시뮬레이션
function simulate(throws) {
    let pos = "Z"; // 현재 위치
    let prev = null; // 직전 위치 (V 통과 판단용)
    let score = 0;
    let err = false;

    for (const ch of throws) {
        const dist = MOVE[ch];
        if (!dist) {
            err = true;
            break;
        }

        for (let step = 0; step < dist; step++) {
            let next;

            // 멈춰 있던 분기점이면 짧은 길 사용
            if (step === 0 && shortBranch.has(pos)) {
                next = shortBranch.get(pos);

                // 특수: 통과 방향 판정
            } else if (pos === "V") {
                next = prev?.startsWith("XV") ? "VZ1" : "VY1";

                // 일반 직진
            } else {
                next = nextDefault.get(pos);
            }

            // 이동
            prev = pos;
            pos = next;

            if (!pos) {
                err = true;
                break;
            }
            if (pos === "Z") score++;
        }
        if (err) break;
    }

    const loc = err ? "ERR" : toLabel(pos);
    return [score, loc];
};


// 메인 함수
function score(players = []) {
    // 입력 검증
    const n = players.length;
    if (n < 2 || n > 10) return ["ERROR"];
    if (new Set(players.map(s => s.length)).size !== 1) return ["ERROR"];

    return players.map(p => {
        const [s, loc] = simulate(p);
        return `${s}, ${loc}`;
    });
}

console.log(score(["DG", "D"]));                   
console.log(score(["DGD", "MGG"]));                 
console.log(score(["DGGG", "MGGA"]));                  
console.log(score(["DGDGGK", "DDDDDK", "KKKKKD"])); 