import net from 'node:net';

const sock = net.connect(2025);

const token = 'hash-token'

sock.setEncoding('utf8');
sock.on('data', d => {
    process.stdout.write('<<< ' + d +'\n');

    if (d.trim() === 'logout success') {
        console.log('로그아웃 성공 -> 연결 종료')
        sock.end();
    }
})

process.stdin.on('data', line => {
    const input = line.toString().trim()

    if(input === 'auth') {
        sock.write(input + ' ' + token);
    } else {
        sock.write(input)
    }
})