import fs from 'node:fs';

const FileTuple = (name, size = 0, content = "") => ({
    name,
    type: 'file',
    size,
    content       // 텍스트파일이면 내용, 바이너리면 Buffer 등으로 처리 가능
});

const DirTuple = (name, totalSize = 0) => ({
    name,
    type: 'dir',
    totalSize,
    children: []    // 디렉토리는 children이 꼭 필요!
});

export class Vfs {

    #DAT_FILE;

    constructor() {
        this.#DAT_FILE = './ch7.dat';
    }

    #saveFile(maxSize, root) {
        const content = `${maxSize}\n${JSON.stringify(root)}\n`;
        fs.writeFileSync(this.#DAT_FILE, content, 'utf-8');
    }

    #loadFile() {
        const raw = fs.readFileSync(this.#DAT_FILE, 'utf-8');
        const [maxSizeLine, rootLine] = raw.split('\n');
        const root = JSON.parse(rootLine);
        const maxSize = Number(maxSizeLine);
        return { root, maxSize }
    }

    #findNode(root, targetDirAdd) {
        const parts = targetDirAdd.split('/').filter(Boolean);

        let current = root;
        for (const name of parts) {
            if (!current.children) {
                return null;
            }
            const found = current.children.find(child => child.name === name);
            if (!found) {
                return null;
            }
            current = found;
        }
        return current;
    }

    initVFS(maxSize) {
        const root = DirTuple('/');
        this.#saveFile(maxSize, root);
    }

    list() {

    }

    mkdir(momDir, newDir) {
        const { root, maxSize } = this.#loadFile();
        const node = this.#findNode(root, momDir);
        if (node.children.find(child =>
            child.type === 'dir' &&
            child.name === newDir
        )) {
            console.log('이미 같은 이름의 디렉토리 존재');
            return;
        }
        const newNode = DirTuple(newDir);
        node.children.push(newNode);
        this.#saveFile(maxSize, root);
    }

    create() {

    }

    read() {

    }

    export() {

    }

}

// const test = new Vfs();
// test.initVFS(500);