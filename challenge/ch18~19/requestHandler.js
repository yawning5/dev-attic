import { isLogin, login, logout, mdLogin, hasMd, sessionReg, sessionOut } from "./connectionHandler.js";
import { addGoods, buyGoods, getCatalog } from "./productHandler.js";

let activeChat = null;
let chatActivator = null;

export function requestHandler(sock, line) {
    const [command, ...rest] = line.split(' ');
    const content = rest.join(' ').trim();
    console.log(command)
    switch (command) {
        case 'connect':
            sessionReg(sock);
            break;
        case 'login':
            return login(sock, content);
        case 'logout':
            isLogin(sock)
            logout(sock);
            break;
        case 'catalog':
            isLogin(sock)
            return getCatalog(sock);
        case 'buy':
            isLogin(sock)
            return buyGoods(sock, content);
        case 'snapchat':
            isLogin(sock)
            createChat(sock, content);
            break;
        case 'auth':
            mdLogin(sock, content);
            break;
        case 'add':
            if (!hasMd) throw new Error (`md 만 사용 가능합니다`)
            return addGoods(sock, content);
        case 'disconnected':
            sessionOut(sock);
            break;
    }
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

