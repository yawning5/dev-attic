import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process';
import { commandBroker } from './command.js';

const rl = readline.createInterface({
    input,
    output
});

/*
받아야하는 명령어
git add
git commit
git log
*/

console.log('포맷 git <명령어>')

rl.on('line',  (answer) => {
    if (!answer.startsWith('git')) throw new Error('포맷 git <명령어>')
    const command = answer.split(' ')[1];

    commandBroker(command);

    rl.prompt();
})

rl.prompt();