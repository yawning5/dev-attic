import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib';

export function readGitHEAD(repoPath = process.cwd()) {
    const gitDir = path.join(repoPath, '.git');
    const headFile = path.join(gitDir, 'HEAD');
    if (!fs.existsSync(headFile)) {
        throw new Error(`.git/HEAD not found in ${repoPath}`);
    }
    // 현재 브랜치 커밋의 파일 경로가 들어있다
    // 형식은 ref: refs/heads/test
    const headContent = fs.readFileSync(headFile, 'utf-8').trim().split(' ')[1];
    const commitHashFile = path.join(gitDir, headContent);
    const commitHash = fs.readFileSync(commitHashFile, 'utf-8').trim();

    return commitHash;
}

export function readCommitData(commitHash = readGitHEAD(), repoPath = process.cwd()) {
    const buf = readObject(commitHash, repoPath);
    return parseCommitBuffer(buf);
}

function parseCommitBuffer(buf) {
    // git 의 오브젝트 포맷은 'type size\0payload
    // ex) commit 247\0payload
    const nullIdx = buf.indexOf(0);
    const header = buf.slice(0, nullIdx).toString('utf8');
    const bodyStr = buf.slice(nullIdx + 1).toString('utf8');
    // console.log(bodyStr);

    const [metaPart, message] = bodyStr.split('\n\n');
    const metaLines = metaPart.split('\n');

    const result = { header };

    for (const line of metaLines) {
        const [key, ...rest] = line.split(' ');
        result[key] = rest.join(' ');
    }
    result.message = message.trimEnd();

    return result;
}

function readObject(hash, repoPath = process.cwd()) {
    // 폴더 경로
    const objDir = path.join(repoPath, '.git', 'objects', hash.slice(0, 2));
    // 파일 경로
    const objPath = path.join(objDir, hash.slice(2));
    const raw = fs.readFileSync(objPath);
    return zlib.inflateSync(raw);
}

export function readTree(hash = readCommitData().tree, fullPath = '', repoPath = process.cwd()) {
    const buf = readObject(hash, repoPath);

    // header 자르기: tree <size>\0
    const nullIdx = buf.indexOf(0);
    // payload 시작점
    let idx = nullIdx + 1;

    const entries = [];

    // 엔트리의 바이너리 포맷
    // <mode> <name>\0<20바이트 SHA-1>
    while (idx < buf.length) {
        // mode 추출 (ASCII ' ' 전까지)
        let spaceIdx = buf.indexOf(0x20, idx);
        const mode = buf.subarray(idx, spaceIdx).toString('utf8');

        // filename 추출 (널 전까지)
        let nullIdx2 = buf.indexOf(0x00, spaceIdx + 1);
        const name = buf.subarray(spaceIdx + 1, nullIdx2).toString('utf8');

        // 20byte SHA-1
        const shaBuf = buf.subarray(nullIdx2 + 1, nullIdx2 + 21);
        const sha1 = shaBuf.toString('hex');

        if (mode === '40000') {
            const fullPath = `${name}/`;
            entries.push(...readTree(sha1, fullPath));
        }
        entries.push({ mode, name: fullPath + name, hash: sha1 });

        // 다음 엔트리로 이동
        idx = nullIdx2 + 21;
    }

    return entries;
}

export function readIndex(repoPath = process.cwd()) {
    const indexFile = path.join(repoPath, '.git', 'index')
    const buf = fs.readFileSync(indexFile);

    const entryCnt = buf.readUInt32BE(8);
    const entries = [];
    let offset = 12;

    for (let i = 0; i < entryCnt; i++) {
        const modeInt = buf.readUInt32BE(offset + 24);
        const shaHex = buf.subarray(offset + 40, offset + 60).toString('hex');
        const flags = buf.readUInt16BE(offset + 60);
        const nameLen = flags & 0x0fff;

        const nameStart = offset + 62;
        const nameEnd = nameStart + nameLen;
        const relName = buf.toString('utf8', nameStart, nameEnd);   // <-- 상대 경로

        /* 길이 계산 (NULL + padding) */
        let entrySize = 62 + nameLen + 1;
        while (entrySize % 8) entrySize++;
        offset += entrySize;

        const modeStr = modeInt.toString(8).padStart(6, '0');

        entries.push({ mode: modeStr, name: relName, hash: shaHex });
    }

    return entries;
}

/**
 * 파일내용을 이진데이터로 반환
 * @param {*} fileName 
 * @param {*} repoPath (기본값: process.cwd())
 * @returns (이진테이터) 파일내용
 */
export function readTargetFile(fileName, repoPath = process.cwd()) {
    const filePath = path.join(repoPath, fileName);
    const content = fs.readFileSync(filePath);
    
    return content;
}