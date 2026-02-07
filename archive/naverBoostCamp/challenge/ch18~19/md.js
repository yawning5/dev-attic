import { createSocketClient } from './createSocket.js';

const token = 'hash-token'

createSocketClient({
    port: 2025,
    onInput: (sock, input) => {
        if (input === 'auth') {
            sock.write(input + ' ' + token);
        } else {
            sock.write(input)
        }
    }
});

// const sock = net.connect(2025);

// sock.setEncoding('utf8');
// sock.on('data', d => {
//     process.stdout.write('<<< ' + d + '\n');

//     if (d.trim() === 'logout success') {
//         console.log('로그아웃 성공 -> 연결 종료')
//         sock.end();
//     }
// })

// process.stdin.on('data', line => {
//     const input = line.toString().trim()

//     if (input === 'auth') {
//         sock.write(input + ' ' + token);
//     } else {
//         sock.write(input)
//     }
// })

