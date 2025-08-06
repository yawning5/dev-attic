import net from 'node:net';
import { requestHandler, sessionOut, sessionReg } from './requestHandler.js';

const PORT = 2025;

const server = net.createServer(socket => {
    socket.setEncoding('utf8');

    sessionReg(socket);
    console.log('connected', socket.remoteAddress, socket.remotePort);

    socket.on('data', data => {
        // 접속부
        // console.log(`${data} 수신`)
        socket.write(`데이터 수신: ${data}`)

        try {
            requestHandler(socket, data);
        } catch (error) {
            console.log(`에러 발생: ${error.message}`)
            socket.write(`에러 발생: ${error.message}`)
        }
    })

    socket.on('end', () => {
        sessionOut(socket)
    })
    socket.on('close', () => {
        sessionOut(socket)
    })
    socket.on('error', () => {
        sessionOut(socket)
    })
})



server.listen(PORT, () => console.log(`TCP server on ${PORT}`))
