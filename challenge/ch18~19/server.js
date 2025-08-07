import net from 'node:net';
import dgram from 'node:dgram';
import { requestHandler } from './requestHandler.js';

const PORT = 2025;
const BROADCAST_ADDR = '255.255.255.255';
const udpSock = dgram.createSocket({ type: 'udp4', reuseAddr: true });

udpSock.bind(PORT, () => {
    udpSock.setBroadcast(true)

    // setInterval(() => {
    //     const message = Buffer.from(`방송메세지입니다`);
    //     udpSock.send(message, 0, message.length, UDP_PORT, BROADCAST_ADDR,
    //         (err) => {
    //             if (err) console.error(`Send err:`, err);
    //         })
    // }, 1000)
});

udpSock.on('message', (msg, rInfo) => {
    console.table([{
        address: rInfo.address,
        port: rInfo.port,
        message: msg.toString()
    }]);
})

const server = net.createServer(socket => {
    socket.setEncoding('utf8');

    requestHandler(socket, 'connect');
    console.log('connected', socket.remoteAddress, socket.remotePort);

    socket.on('data', data => {
        // 접속부
        // console.log(`${data} 수신`)
        socket.write(`데이터 수신: ${data}`)

        try {
            const announce = requestHandler(socket, data);
            if (announce.protocol === 'udp') {
                udpSock.send(announce.msg, PORT, BROADCAST_ADDR, (err) => {
                    if(err) console.error('send 에러', err);
                    else console.log('방송성공')
                })
            } else {
                socket.write('\n' + announce + '\n');
            }
        } catch (error) {
            console.log(`에러 발생: ${error.message}`)
            socket.write(`에러 발생: ${error.message}`)
        }
    })

    socket.on('end', () => {
        requestHandler(socket, 'disconnected')
    })
    socket.on('close', () => {
        requestHandler(socket, 'disconnected')
    })
    socket.on('error', () => {
        requestHandler(socket, 'disconnected')
    })
})



server.listen(PORT, () => console.log(`TCP server on ${PORT}`))