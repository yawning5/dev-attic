import { readFile, access } from 'node:fs/promises'
import path, { resolve } from 'node:path'

// ----------------- 파일 내부를 읽어오는 부분 ----------------------

// // 현재 파일의 위치를 반환한다 ex) file:///Users/john/project/index.js
// const _filename = import.meta.filename;

// 현재 폴더의 위치를 반환한다 ex) file:///Users/john/project
const _dirname = import.meta.dirname;

// 프로젝트 루트 
// resolve 오른쪽 -> 왼쪽으로 읽으면서 중간에 절대 경로가 있다면 거기서 멈춘뒤
// 그 앞의 .. . 파일이름 등을 모두 정리해 하나의 절대 경로로 반환한다
const rootDir = resolve(_dirname, '..', '..'); // ../../

// data.model 의 절대 경로
const modelFile = resolve(rootDir, 'data.model');

// 파일 읽기
// readFile 파일 내용을 지정된 인코딩 형식으로 읽어서 메모리에 로드한다
const raw = await readFile(modelFile, 'utf8');


// data.model 안에서 path="..." 값만 뽑기
// 뒤에 붙는 g 는 전체 문자열에서 여러번 매치한다는 뜻
// 따옴표 안 경로 캡처
// 한 줄 형태: path="Objects/A.model" objectid="1"
const entryRe = /path="([^"]+)"\s+objectid="([^"]+)"/g;

const entries = [...raw.matchAll(entryRe)].map(m => ({
    relPaths: m[1],        // "Objects/A.model" - 첫번째 캡쳐 그룹
    id: Number(m[2]),      // 1, 3, 5 ... - 두번째 캡처 그룹
}))

// raw.matchAll(entryRe) 로 raw 의 문자열중 정규식에 맞는 부분 캡처후 ... 로 spread
// .map(m => m[1]) 을 이용해서 캡처된(정규식에서 ()괄호 안 표현식)문자열 배열로 변환
// const relPaths = [...raw.matchAll(entryRe)].map(m => m[1]);
// 반환되는것 "Object/A.model", "Object/B.model", ... 등의 상대경로
// objectid 도 가져오기 위해 수정됨

// 상대경로 -> 절대경로로 변환
const absEntries = entries.map(e => ({
    ...e,                                       // 기존 객체 e 의 모든 속성을 펼칭
    absPaths: resolve(rootDir, e.relPaths),    // 새 속성을 추가
}));

// absPaths 의 각 요소였던 파일의 절대경로를 map과 readFile 을 통해 각 파일의 내용으로 변환
// files 에는 이제 각 A, B, C 모델들의 파일내용이 문자열로 담겨있다
// const files = await Promise.all(
//     absPaths.map(p => readFile(p, 'utf8'))
// );
// objectid 도 담기위해 코드를 변경하였음

// 각 .model 파일 내용을 병렬로 읽기
const fileContents = await Promise.all(
    absEntries.map(e => readFile(e.absPaths, 'utf8'))
)

// 경로 내용을 하나로 묶어 배열로 관리
const models = absEntries.map((e, Idx) => ({
    id: e.id,
    path: e.relPaths,
    data: fileContents[Idx],
}));

console.log(models[0]);

/*
진행된 순서
1. 현재 폴더의 위치를 절대경로로 받아온다 import.meta.dirname
2. 프로젝트 루트 dir 를 찾는다
3. data.model 의 절대경로를 찾는다
4. readFile 을 이용해 data.model 의 파일내용을 읽어온다
5. /path = "([^"]+)"/g 정규식을 사용해서 상대경로를 캡쳐
6. matchAll 메서드를 이용해서 정규식과 맞는 문자열을 가져온후 
   ... 로 spread .map(p => p[1]) 을 통해 정규식으로 캡처된 부분만 가져온다
7. 캡처된 부분은 각 model 의 상대경로이므로 map 내부에서 루트 dir 과 resolve 해서 각 model 의 절대경로로 변경
8. 각 요소들을 모델 내부의 문자열로 변경하기 위한 readFile
*/

// ---------- 파일 요소 처리부분 ------------------

const parseModel = txt => {
    // 빈줄 기준으로 분리
    const [vertexPart, triPart] = txt.split(/\n\s*\n/);

    // vertex 파싱
    const vtxRegex = /x="([^"]+)"\s+y="([^"]+)"\s+z="([^"]+)"/g;
    const vertices = [...vertexPart.matchAll(vtxRegex)]
        .map(m => ({ x: +m[1], y: +m[2], z: +m[3] }));

    // triangle 파싱
    const triRegex = /v1="([^"]+)"\s+v2="([^"]+)"\s+v3="([^"]+)"/g;
    const triangles = [...triPart.matchAll(triRegex)]
        .map(m => ({ v1: +m[1], v2: +m[2], v3: +m[3] }));

    return { vertices, triangles };
}

const analyseTriangle = (vA, vB, vC) => {
    // 축 길이
    const dx = Math.max(vA.x, vB.x, vC.x) - Math.min(vA.x, vB.x, vC.x);
    const dy = Math.max(vA.y, vB.y, vC.y) - Math.min(vA.y, vB.y, vC.y);
    const dz = Math.max(vA.z, vB.z, vC.z) - Math.min(vA.z, vB.z, vC.z);

    // 면적 = |(B−A)×(C−A)| / 2
    const AB = { x: vB.x - vA.x, y: vB.y - vA.y, z: vB.z - vA.z };
    const AC = { x: vC.x - vA.x, y: vC.y - vA.y, z: vC.z - vA.z };
    const cross = {
        x: AB.y * AC.z - AB.z * AC.y,
        y: AB.z * AC.x - AB.x * AC.z,
        z: AB.x * AC.y - AB.y * AC.x,
    };
    const area = 0.5 * Math.hypot(cross.x, cross.y, cross.z);

    return { dx, dy, dz, area };
};

let maxX = { len: -Infinity, objId: null };
let maxY = { len: -Infinity, objId: null };
let maxZ = { len: -Infinity, objId: null };
let maxA = { area: -Infinity, objId: null };

for (const m of models) {
    const { vertices, triangles } = parseModel(m.data);

    for (const t of triangles) {
        const res = analyseTriangle(
            vertices[t.v1], vertices[t.v2], vertices[t.v3]
        )

        if (res.dx > maxX.len) { maxX = { len: res.dx, objId: m.id }; }
        if (res.dy > maxY.len) { maxY = { len: res.dy, objId: m.id }; }
        if (res.dz > maxZ.len) { maxZ = { len: res.dz, objId: m.id }; }
        if (res.area > maxA.area) { maxA = { area: res.area, objId: m.id }; }
    }
}

// ----------------- 로딩 바 -------------------
const progressBar = (ms = 5000, steps = 10) => new Promise(resolve => {
  const interval = ms / steps;
  const BAR_WIDTH = steps;                     // 한 줄에 '=' 몇 칸

  let i = 0;
  const timer = setInterval(() => {
    // 1) 진행도 계산
    const bar = '='.repeat(i).padEnd(BAR_WIDTH, ' ');
    const pct = String(i * 10).padStart(3, ' ');

    // 2) '\r' 로 커서를 앞으로 보내고, 같은 길이로 덮어쓰기
    const line = `분석 진행: [${bar}] ${pct}%`;
    process.stdout.write('\r' + line);

    // 3) 완료 처리
    if (i++ === steps) {
      clearInterval(timer);
      process.stdout.write('\n');   // 줄바꿈 한 번만
      resolve();
    }
  }, interval);
});

await progressBar();


// ------------ 결과 출력 --------------
console.log('\n===== 분석 결과 =====');
console.log(`X축 길이 최대 Triangle 포함 ObjectID  : ${maxX.objId}`);
console.log(`Y축 길이 최대 Triangle 포함 ObjectID  : ${maxY.objId}`);
console.log(`Z축 길이 최대 Triangle 포함 ObjectID  : ${maxZ.objId}`);
console.log(`면적  최대 Triangle 포함 ObjectID    : ${maxA.objId}`);