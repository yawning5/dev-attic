import { isLogin, login, logout, mdLogin, hasMd, sessionReg, sessionOut, createChat, isGroup } from "./connectionHandler.js";
import { addGoods, buyGoods, getCatalog } from "./productHandler.js";

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
        case 'message':
            isLogin(sock);
            isGroup(sock);
            return { protocol: 'udp', msg: content};
        case 'auth':
            mdLogin(sock, content);
            break;
        case 'add':
            if (!hasMd) throw new Error(`md 만 사용 가능합니다`)
            return addGoods(sock, content);
        case 'disconnected':
            sessionOut(sock);
            break;
    }
}


