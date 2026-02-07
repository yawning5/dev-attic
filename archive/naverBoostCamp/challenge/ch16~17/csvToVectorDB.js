import fs from 'fs';
import csv from 'csv-parser';
import { get768Vector } from './embedding.js';
import { VectorDB } from './VectorDB.js';
import { resolve } from 'path';

/*
저장할 레코드 포맷
{
id: 0,
question1: str
question2: str
vector: [cosine, euclidean, freq]
}
*/

const freqMap = new Map();

const rows = [];

await new Promise((resolve) => {
    fs.createReadStream('challenge/ch16~17/test.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row.question1 && row.question2) {
                rows.push(row);
                freqCheck(row.question1);
                freqCheck(row.question2);
            }
        })
        .on('end', () => {
            fs.writeFileSync(
                'challenge/ch16~17/word_freq.json',
                JSON.stringify(Object.fromEntries(freqMap), null, 2)
            );
            resolve();
        })
})

const db = await new VectorDB(768, './challenge/ch16~17').init();
let idCounter = 0;

for (const row of rows) {
    const { question1: q1, question2: q2 } = row;
    const v1 = await get768Vector(q1);
    const v2 = await get768Vector(q2);

    const record = {
        id: idCounter++,
        question1: q1,
        question2: q2,
        vector: [
            cosine(v1, v2),
            euclidean(v1, v2),
            getFreqScore(q1) + getFreqScore(q2)
        ]
    };

    await db.add(record);
}

function freqCheck(question) {
    const words = question.trim().split(/\s+/);

    for (const word of words) {
        const count = freqMap.get(word) || 0;
        freqMap.set(word, count + 1);
    }
}

function cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function euclidean(a, b) {
    return Math.sqrt(
        a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0)
    );
}

function getFreqScore(sentence) {
    return sentence
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .reduce((sum, word) => sum + (freqMap.get(word) || 0), 0);
}
