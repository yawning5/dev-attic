// 문제 풀이 부분
function match(param0) {

    const files = new Map();

    /**
     * /d/a/x_v2.zg -> x.zg
     * @param {Array} str - 경로가 포함된 파일명
     * @returns {string} - 경로와 버전이 제거된 파일명
     */
    function extractFileName(str) {
        const address = str.split('/');
        const file = address[address.length - 1];
        if (file.includes('_')) {
            const _pos = file.indexOf('_');
            const dotPos = file.indexOf('.');
            const fileName = file.substring(0, _pos) + file.substring(dotPos);
            return fileName;
        } else return file;
    }

    /**
     * 
     * @param {Array} allFiles - 파일명만 있는 배열
     * @returns {Map} - 2개 이상의 파일이 있는 파일명들을 모은 Map
     */
    function dupFiles(allFiles) {
        const dupFileMap = new Map(
            Array.from(allFiles.entries())
                .filter(([k, v]) => v >= 2)
        );
        // entries 는 콜백이 (element, index, array) 를 인자로 받기 때문에
        // (k, v) 를 하고 싶으면 구조분해를 사용해야함 ([k, v])
        // filter 의 역한은 true 인 요소만 배열에 남기는 역할
        // 부수효과 없이 조건만 평가하는게 맞음 아래처럼 사용 x
        // .filter((k, v) => v >= 2 ? dupFiles.set(k, v) : allFiles.delete(k))
        return dupFileMap;
    }

    for (const str of param0) {
        const fileName = extractFileName(str);
        files.set(
            fileName,
            files.get(fileName) === undefined ? 1 : files.get(fileName) + 1
        );
    }

    // console.log(JSON.stringify(files.entries()) + 'line 39');
    // entries 는 이터레이터이므로 JSON.stringify() 에 제대로 안 찍힘
    console.log(JSON.stringify(Array.from(files.entries())));

    return dupFiles(files);
}

let param0 = ["/a/a_v2.xa", "/b/a.xa", "/c/t.zz", "/d/a/t.xa", "/e/z/t_v1.zz", "/k/k/k/a_v9.xa"]
let result = match(param0);

console.log(result);

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
    const fileArray = inputs[0].split(',');
    const answer = match(fileArray);
    if (answer.size == 0) {
        console.log("!EMPTY");
        rl.close();
        return;
    }
    for (const [key, value] of answer) {
        console.log(key + "=" + value);
    }
    rl.close();
});
