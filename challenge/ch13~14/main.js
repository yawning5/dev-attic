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

git realAdd <파일명>
*/

console.log('포맷 git <명령어>')

rl.on('line',  (answer) => {
    if (!answer.startsWith('git')) throw new Error('포맷 git <명령어>')
    const commandArgs = answer.split(' ');
    const command = commandArgs[1];

    commandBroker(command, commandArgs[2]);

    rl.prompt();
})

rl.prompt();