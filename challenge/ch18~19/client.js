import dgram from 'dgram';
import { createSocketClient } from './createSocket.js';

createSocketClient({
    port: 2025,
    onInput: (sock, input) => {
        sock.write(input);
    }
})

const PORT = 2025;
const BROADCAST_ADDR = '255.255.255.255';

const udpSock = dgram.createSocket({ type: 'udp4', reuseAddr: true });

udpSock.on('listening', () => {
    const address = udpSock.address();
    console.log(`방송 듣는중 ${address.address}:${address.port}`)

    udpSock.setBroadcast(true);

    udpSock.send('im client', PORT, BROADCAST_ADDR, (err) => {
        if(err) console.error('send 에러', err);
        else console.log('전송 완료')
    })
})

udpSock.on('message', (message, rinfo) => {
    console.log(
        `${rinfo.address}:${rinfo.port} 로부터온 메세지 -> ${message}`
    )
})

udpSock.bind(PORT, () => {
    console.log(`socket bound for receiving`)
})


// const sock = net.connect(2025);

// sock.setEncoding('utf8');
// sock.on('data', d => {
//     process.stdout.write('<<< ' + d +'\n');

//     if (d.trim() === 'logout success') {
//         console.log('로그아웃 성공 -> 연결 종료')
//         sock.end();
//     }
// })

// process.stdin.on('data', line => {
//     sock.write(line.toString().trim())
// })