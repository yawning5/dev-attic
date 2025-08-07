import net from 'node:net'

export function createSocketClient({ port, onInput }) {
    const sock = net.connect(port);

    sock.setEncoding('utf8');
    sock.on(`data`, d => {
        process.stdout.write(`<<< ${d} \n`)
        if (d.trim() === 'logout success') {
            console.log(`로그아웃 성공 -> 연결 종료`)
            sock.end();
        }
    })

    process.stdin.on(`data`, line => {
        onInput(sock, line.toString().trim());
    })

    return sock
}