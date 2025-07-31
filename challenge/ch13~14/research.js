import { read } from "fs";
import { readCommitData, readGitHEAD, readIndex, readTree } from "./readfile.js";

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
    console.log(`.git/objects/${readGitHEAD().slice(0,2)}/${readGitHEAD().slice(2)}`)
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
