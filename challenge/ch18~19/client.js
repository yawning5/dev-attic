import net from 'node:net';

const sock = net.connect(2025);

sock.setEncoding('utf8');
sock.on('data', d => {
    process.stdout.write('<<< ' + d);
})

process.stdin.on('data', line => {
    sock.write(line.toString().trim()+'\n')
})