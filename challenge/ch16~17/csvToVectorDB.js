import fs from 'fs';
import csv from 'csv-parser';

const results = [];

fs.createReadStream('challenge/ch16~17/test.csv')
.pipe(csv())
.on('data', (row) => {
    const q1 = row['question1'];
    const q2 = row['question2'];

    if (q1 && q2) {
        results.push({ question1: q1, question2: q2 });
    }
})
.on('end', () => {
    console.log(JSON.stringify(results.slice(0, 3), null, 2))
})

