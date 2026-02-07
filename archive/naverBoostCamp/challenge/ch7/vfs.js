import fs from 'node:fs';

const FileTuple = (name, size = 0, content = "", parent = null) => ({
    name,
    type: 'file',
    size,
    content,       
    parent
});

const DirTuple = (name, totalSize = 0, parent = null) => ({
    name,
    type: 'dir',
    totalSize,
    children: [],    
    parent
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
        // console.log(`\nfindNode 작동 root 값 ${root}, target 값 ${targetDirAdd}\n`)
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

    list(momDir) {
        const { root, maxSize } = this.#loadFile();
    }

    mkdir(momDir, newDir) {
        const { root, maxSize } = this.#loadFile();
        const momNode = this.#findNode(root, momDir);
        if (momNode.children.find(child =>
            child.type === 'dir' &&
            child.name === newDir
        )) {
            console.log('이미 같은 이름의 디렉토리 존재');
            return;
        }
        const newNode = DirTuple(newDir, 0, momDir);
        momNode.children.push(newNode);
        this.#saveFile(maxSize, root);

        return this.#findNode(root, '/').size
    }

    create(momDir, fileName, content) {
        const { root, maxSize } = this.#loadFile();
        const momNode = this.#findNode(root, momDir);
        const contentSize = Buffer.byteLength(content, 'utf-8');
        if (maxSize - root.size - contentSize < 0) {
            console.log('용량 초과');
            return;
        } else if (momNode.children.find(child =>
            child.type === 'file' &&
            child.name === fileName
        )) {
            console.log('이미 같은 이름의 파일 존재')
            return;
        }
        const txtFile = FileTuple(fileName, contentSize, content, momDir);
        momNode.children.push(txtFile);

        let current = momNode;

        // console.log(`create 작동`)
        // console.log(current.totalSize)

        while (current) {
            // console.log(`현재 디렉토리 이름 ${current.name} 변경전 사이즈 ${current.totalSize}`)
            current.totalSize += contentSize;
            // console.log(`현재 디렉토리 이름 ${current.name} 변경후 사이즈 ${current.totalSize}`)
            // console.log(`현재 디렉토리 이름 ${current.name} 루트노드 ${current.parent}`)
            if (!current.parent) {break}
            current = this.#findNode(root, current.parent);
            
        }
        this.#saveFile(maxSize, root);

        const size = this.#findNode(root, '/').totalSize;
        // console.log(`사이즈 측정 ${size}, ${maxSize}`);
        return (maxSize - size);
    }

    read() {

    }

    export() {

    }

}

// const test = new Vfs();
// test.initVFS(500);