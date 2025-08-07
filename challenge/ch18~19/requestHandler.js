import { group } from "node:console";

const clients = new Map();
const groups = [];
const sessions = new Map();
const token = 'hash-token';
let activeChat = null;
let chatActivator = null;
let hasMd = null;

export function requestHandler(sock, line) {
    const [command, ...rest] = line.split(' ');
    const content = rest.join(' ').trim();
    console.log(command)
    switch (command) {
        case 'login':
            login(sock, content);
            break;
        case 'logout':
            logout(sock);
            break;
        case 'catalog':
            getCatalog(sock);
            break;
        case 'buy':
            buyGoods(sock, content);
            break;
        case 'snapchat':
            createChat(sock, content);
            break;
        case 'auth':
            mdLogin(sock, content);
            break;
        case 'add':
            addGoods(sock, content);
            break;
    }
}

export function sessionReg(sock) {
    const id = sessions.size
    sessions.set(sock, sessions.size + 1)
}

export function sessionOut(sock) {
    sessions.delete(sock);
    clients.delete(sock);
}

function login(sock, content) {
    if (!content.startsWith('S')) return sock.write(`S 로 시작하는 ID 가 필요합니다`)
    const numStr = content.slice(1);
    if (!/^\d{3}$/.test(numStr)) return sock.write(`S001 ~ S256 만 가능합니다`);
    if (+numStr < 1 || +numStr > 256) return sock.write(`S001 ~ S256 만 가능합니다`);
    if (clients.has(sock)) return sock.write(`ERROR: 이미 로그인한 세션 입니다.`);
    const isOdd = Array.from(clients.values()).some(n => n.campId === content)
    if (isOdd) return sock.write(`이미 로그인된 ID 입니다`)

    let groupNo = groups.findIndex(g => g.size < 4);
    if (groupNo === -1) {
        groupNo = groups.push(new Set()) - 1
    }

    groups[groupNo].add(sock);
    const sessionId = clients.size;
    clients.set(sock, { campId: content, group: groupNo, sessionId });

    sock.write(`login success to group#${groupNo}`);
    console.log(`login ${content} (success) from ${sock.remoteAddress}${sock.remotePort} => session#${sessions.get(sock)}, group#${groupNo}`)
}

function logout(sock) {

    if (hasMd === sock) {
        hasMd = null;
    } else {
        groups[clients.get(sock).group].delete(sock)
        clients.delete(sock);
    }

    sock.write('logout success');
}

function getCatalog(sock) {
    isLogin(sock);
    if (goodsList.length < 15) return sock.write(`error 상품갯수가 모자랍니다`);
    sock.write(`items are ${JSON.stringify(goodsList, null, 2)}`);
}

function buyGoods(sock, content) {
    isLogin(sock);
    const [id, count] = content.split(' ');
    const product = goodsList.find(n => n.id === +id);
    if (!product) throw new Error(`없는 상품`);
    if (product.stock < count) throw new Error(`재고 부족`);

    product.stock = product.stock - count;
    sock.write(`${id} ${product.name} *${count} purchased`)
}

function createChat(sock, content) {
    isLogin(sock);
    if (activeChat) throw new Error(`이미 활성화 된 채팅방 존재`);
    const { group } = clients.get(sock);
    const max = content.match(/maxCount=(\d+)/)
    if (!max) throw new Error(`maxCount 필요`)
    activeChat = { group, left: +max[1] }
    chatActivator = sock;
    for (const member of groups[group]) {
        member.write(`채팅이 시작 되었습니다`);
    }
}

function isLogin(sock) {
    if (sock === hasMd) return
    if (!clients.has(sock)) {
        sock.write(`로그인 후 이용가능합니다`)
        throw new Error('로그인 필요');
    }
}

function mdLogin(sock, content) {
    if (hasMd) {
        throw new Error(`이미 로그인한 md 존재`);
    }
    if (content != token) throw new Error(`인증키가 다릅니다`);

    hasMd = sock;
}

function addGoods(sock, content) {
    if(!hasMd || hasMd !== sock) {
        throw new Error (`md 만 접근가능한 명령어 입니다`);
    }
    console.log(content)
    const [id, name, count] = content.split(' ');

    let product = goodsList.find(n => n.name === name);
    if (!product) {
        product = {
            id: goodsList.length + 1,
            name: name,
            stock: count
        }
        goodsList.push(product)
    } else if (product) {
        product.stock = product.stock + count;
    }

    sock.write(`${id} ${name} total = ${product.stock}`)
}

const goodsList = [
    { id: 1, name: '무선 마우스', stock: 25 },
    { id: 2, name: '유선 키보드', stock: 40 },
    { id: 3, name: '게이밍 모니터', stock: 10 },
    { id: 4, name: 'USB C타입 케이블', stock: 100 },
    { id: 5, name: '노트북 거치대', stock: 15 },
    { id: 6, name: '외장 SSD 1TB', stock: 8 },
    { id: 7, name: '블루투스 스피커', stock: 12 },
    { id: 8, name: '책상 조명', stock: 18 },
    { id: 9, name: '웹캠 1080p', stock: 22 },
    { id: 10, name: '마이크 스탠드', stock: 13 },
    { id: 11, name: '헤드셋', stock: 30 },
    { id: 12, name: 'HDMI 케이블', stock: 55 },
    { id: 13, name: '노트북 백팩', stock: 17 },
    { id: 14, name: '무선 충전기', stock: 20 },
    { id: 15, name: '기계식 키보드', stock: 7 },
    { id: 16, name: '그래픽 타블렛', stock: 5 },
    { id: 17, name: '스마트폰 거치대', stock: 33 },
    { id: 18, name: '랜선 10m', stock: 42 }
];
