import { promises as fs } from 'fs';
import path from 'path';

export class VectorDB {

    constructor(dim, baseDir = '.', fsModule = fs) {
        this.fs = fsModule;
        this.lastId = 0;
        this.dim = dim
        this.data = [];
        this.path = path.join(baseDir, `${dim}vector.json`);
    }

    async init() {
        let raw = await this.fs.readFile(this.path, 'utf-8');
        if (!raw.trim()) {
            raw = '[]'
        }
        this.data = JSON.parse(raw);
        this.lastId = this.data.reduce((max, rec) => Math.max(max, rec.id), -1) + 1;

        return this;
    }

    /**
     * 
     * @param {} record { id: num, sentence: string, vector: arr} 포맷의 객체
     */
    async add(record) {
        console.log(record)
        if (record.vector.length !== this.dim) {
            throw new Error(`차원 불일치: expected ${this.dim}`);
        }
        record.id = this.lastId++;
        this.data.push(record);
        await this.#save();
    }

    async removeById(id) {
        const idx = this.data.findIndex(n => n.id === id);
        if (idx != -1) {
            this.data.splice(idx, 1);
            await this.#save();
        }
    }

    async #save() {
        await this.fs.writeFile(this.path, JSON.stringify(this.data, null, 2));
    }

    async knn(input) {

    }


}