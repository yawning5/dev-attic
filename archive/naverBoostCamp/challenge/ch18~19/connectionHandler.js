export const clients = new Map();
export const groups = [];
export let hasMd = null;
const token = 'hash-token';
export const sessions = new Map();
export let activeChat = null;
export let chatActivator = null;

export function login(sock, content) {
    if (!content.startsWith('S')) return sock.write(`S 로 시작하는 ID 가 필요합니다`);
    const numStr = content.slice(1);
    if (!/^\d{3}$/.test(numStr)) return sock.write(`S001 ~ S256 만 가능합니다`);
    if (+numStr < 1 || +numStr > 256) return sock.write(`S001 ~ S256 만 가능합니다`);
    if (clients.has(sock)) return sock.write(`ERROR: 이미 로그인한 세션 입니다.`);
    const isOdd = Array.from(clients.values()).some(n => n.campId === content);
    if (isOdd) return sock.write(`이미 로그인된 ID 입니다`);

    let groupNo = groups.findIndex(g => g.size < 4);
    if (groupNo === -1) {
        groupNo = groups.push(new Set()) - 1;
    }

    groups[groupNo].add(sock);
    const sessionId = clients.size;
    clients.set(sock, { campId: content, group: groupNo, sessionId });

    console.log(`login ${content} (success) from ${sock.remoteAddress}${sock.remotePort} => session#${sessions.get(sock)}, group#${groupNo}`);
    return (`login success to group#${groupNo}`);
}

export function logout(sock) {

    if (hasMd === sock) {
        hasMd = null;
    } else {
        groups[clients.get(sock).group].delete(sock);
        clients.delete(sock);
    }

    return('logout success');
}

export function isLogin(sock) {
    if (sock === hasMd) return;
    if (!clients.has(sock)) {
        throw new Error (`로그인 이후 사용가능합니다`)
    }
}

export function mdLogin(sock, content) {
    if (hasMd) {
        throw new Error(`이미 로그인한 md 존재`);
    }
    if (content != token) throw new Error(`인증키가 다릅니다`);

    hasMd = sock;
}

export function sessionReg(sock) {
    const id = sessions.size;
    sessions.set(sock, sessions.size + 1);
}

export function sessionOut(sock) {
    sessions.delete(sock);
    clients.delete(sock);
}

export function createChat(sock, content) {
    if (activeChat) throw new Error(`이미 활성화 된 채팅방 존재`);
    const { group } = clients.get(sock);
    const max = content.match(/maxCount=(\d+)/);
    if (!max) throw new Error(`maxCount 필요`);
    activeChat = { group, left: +max[1] };
    chatActivator = sock;
    for (const member of groups[group]) {
        member.write(`채팅이 시작 되었습니다`);
    }
}

export function isGroup(sock) {
    const { group } = clients.get(sock);
    if (group !== activeChat.group) throw new Error(`그룹원만 채팅이 가능합니다`);
}

