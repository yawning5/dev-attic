import zlib from 'zlib';
import fs, { link } from 'node:fs'
import path from 'path';
import crypto from 'crypto';
import { readCommitData, readGitHEAD, readIndex, readTargetFile, readTree } from "./readfile.js";

export function researchGitAdd() {
    const idxEntries = readIndex();
    const treeEntries = readTree();

    console.log(`git add 로 인해 index 에 생긴 변경점 입니다.`)
    for (const a of findUniqueInA(idxEntries, treeEntries)) {
        console.log(a)
    }
}

export function researchCommit() {
    const curTreeEntries = readTree();

    const parentCommit = readCommitData().parent;
    const parentHash = readCommitData(parentCommit).tree;
    const oldTreeEntries = readTree(parentHash);

    console.log(`git commit 으로 인해 objects에 생긴 변경점 입니다.`)
    for (const a of findUniqueInA(curTreeEntries, oldTreeEntries)) {
        console.log(a)
    }
    console.log(`.git/objects/${readGitHEAD().slice(0, 2)}/${readGitHEAD().slice(2)}`)
}

export function printLog(commitHash = readGitHEAD()) {
    console.log(`commit ${commitHash}
    Author: ${readCommitData(commitHash).author.split(' ').slice(0, 2)}
    Date: ${readCommitData(commitHash).author.split(' ').slice(2)}
    
        ${readCommitData(commitHash).message}`
    )

    if (readCommitData(commitHash).parent) {
        printLog(readCommitData(commitHash).parent)
    }
}

function findUniqueInA(A, B) {
    const bSet = new Set(B.map(item => `${item.name}::${item.hash}`));

    return A.filter(item => !bSet.has(`${item.name}::${item.hash}`));
}

export function realGitAdd(fileName) {
    const content = readTargetFile(fileName);

    let header = Buffer.from(`blob ${content.length}\0`);
    const store = Buffer.concat([header, content]);
    const gitHash = crypto.createHash('sha1').update(store).digest('hex');
    const dir = `.git/objects/${gitHash.slice(0, 2)}`;
    const file = `${dir}/${gitHash.slice(2)}`;
    const compressed = zlib.deflateSync(store);

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, compressed);

    let entries = readIndex();
    entries.push({ mode: '100644', name: fileName, hash: gitHash});

    writeIndex(entries);
}

function writeIndex(entries, indexPath = '.git/index') {
    // 1. header
    const header = Buffer.alloc(12);
    header.write('DIRC', 0, 4, 'ascii');
    header.writeUInt32BE(2, 4);
    header.writeUInt32BE(entries.length, 8);

    // 2. 모든 entry를 buffer로 생성
    let entryBufs = [];
    for (const ent of entries) {
        const stat = fs.statSync(ent.name);
        const sha1 = ent.hash;
        const nameBuf = Buffer.from(ent.name, 'utf8');
        let entrySize = 62 + nameBuf.length + 1;
        while (entrySize % 8) entrySize++;
        const entry = Buffer.alloc(entrySize);
        let off = 0;
        entry.writeUInt32BE(Math.floor(stat.ctimeMs / 1000) & 0xffffffff, off);    off += 4;
        entry.writeUInt32BE(((stat.ctimeMs % 1000) * 1000000) & 0xffffffff, off);  off += 4;
        entry.writeUInt32BE(Math.floor(stat.mtimeMs / 1000) & 0xffffffff, off);    off += 4;
        entry.writeUInt32BE(((stat.mtimeMs % 1000) * 1000000) & 0xffffffff, off);  off += 4;
        entry.writeUInt32BE(stat.dev & 0xffffffff, off);   off += 4;
        entry.writeUInt32BE(stat.ino & 0xffffffff, off);   off += 4;
        entry.writeUInt32BE(stat.mode & 0xffffffff, off);  off += 4;
        entry.writeUInt32BE(stat.uid & 0xffffffff, off);   off += 4;
        entry.writeUInt32BE(stat.gid & 0xffffffff, off);   off += 4;
        entry.writeUInt32BE(stat.size & 0xffffffff, off);  off += 4;
        Buffer.from(sha1, 'hex').copy(entry, off);  off += 20;
        entry.writeUInt16BE(nameBuf.length, off);   off += 2;
        nameBuf.copy(entry, off);                   off += nameBuf.length;
        entry.writeUInt8(0, off);                   off += 1;
        // (padding은 Buffer.alloc에서 자동)
        entryBufs.push(entry);
    }

    // 3. header + entries 합치기
    const allBuf = Buffer.concat([header, ...entryBufs]);

    // 4. SHA-1 체크섬
    const shaBuf = crypto.createHash('sha1').update(allBuf).digest();
    const indexBuf = Buffer.concat([allBuf, shaBuf]);

    // 5. 저장
    fs.writeFileSync(indexPath, indexBuf);
}

