import net from 'node:net';
import dgram from 'node:dgram';
import { requestHandler } from './requestHandler.js';

const PORT = 2025;
const UDP_PORT = 41234;
const BROADCAST_ADDR = '255.255.255.255';
const udpSock = dgram.createSocket('udp4');

udpSock.bind(() => {
    udpSock.setBroadcast(true)
});

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
            socket.write('\n' + announce + '\n');
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