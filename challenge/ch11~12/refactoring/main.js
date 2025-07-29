import bus from './bus.js';
import readline from 'node:readline';
import FILE from './model.js';
import { ModuleFactory } from './ModuleFactory.js';
import Looper from './Looper.js';

new ModuleFactory(bus);
new Looper();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askModule() {
    rl.question('모듈 갯수 입력 변환 모듈 갯수:검증 모듈 갯수 ex 3:4', (answer) => {
        const recipe = answer.split(':');
        bus.emit('create:module', recipe);
    })
}

askModule();
console.log('영상 업로드  =  1. 단편(3분)    2. 중편(7분)    3. 장편(15분)\n업로드할 영상을 입력하세요. 예) 단편 2개 => 1:2');
rl.prompt();

rl.on('line', (answer) => {

    const files = [];

    const user_files = answer
        .split(',')
        .map(n => n.trim());

    const fileList = user_files.slice(1);

    for (const file of fileList) {
        const [type, Num] = file.split(':');

        for (let i = 0; i < Num; i++) {
            const file = FILE(type);
            files.push(file);
        }
    }
    rl.prompt();
    bus.emit('addWaitQueue', files);
});