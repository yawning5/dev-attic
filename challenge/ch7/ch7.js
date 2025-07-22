import fs from 'node:fs';
import readline from 'node:readline';
import { Vfs } from './vfs.js';

const dataFilePath = './ch7.dat';
const vfs = new Vfs();


// 인터페이스 생성
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'my-vfs> '
});

function askSize() {
    rl.question('my-vfs> ', (answer) => {
        let size;
        const match = answer.trim().toUpperCase().match(/^(\d+)\s*([Mm])$/)
        if (match) {
            const num = Number(match[1]);
            size = num * 1000 * 1000;
            vfs.initVFS(size);
            console.log((size / 1000 / 1000) + '메가 파일 시스템의 초기화를 완료했습니다.')
            rl.prompt();
        } else {
            console.log(`형식은 M 단위로 입력해 주십시오 ex)500M`)
            askSize();
        }
    })
}

if (fs.statSync(dataFilePath).size === 0) {
    console.log('저장된 파일 시스템이 없습니다.\n파일 시스템의 최대 크기를 입력해 주세요.')
    askSize();
}

rl.prompt();

rl.on('line', (line) => {
    const input = line.trim();

    if (input.startsWith('makedir')) {
        console.log('makedir 호출')
        vfs.mkdir(input.split(' ')[1], input.split(' ')[2])
        rl.prompt();
    }


    // 예시: 'exit' 입력시 종료
    if (input === 'exit') {
        rl.close();
    } else {
        console.log(`입력: ${input}`)
        rl.prompt();
    }
}).on('close', () => {
    console.log('프로그램을 종료합니다')
    process.exit(0);
});

