import net from 'node:net';

const PORT = 2025;
const clients = new Map();

const server = net.createServer(socket => {
    socket.setEncoding('utf8');

    console.log('connected', socket.remoteAddress, socket.remotePort);

    socket.on('data', data => {
        console.log(`${data} 수신`)
        socket.write(`데이터 수신: ${data}`)
    })
})

server.listen(PORT, () => console.log(`TCP server on ${PORT}`))
