import { get384Vector, get768Vector } from "./embedding.js";
import { getVectorDB } from "./singletonFactory.js";

export class VectorService {

    constructor(dim, dbInstance = null) {
        this.dim = dim;
        this.db = dbInstance;
        if (dim === 384) {
            this.convert = get384Vector;
        } else if (dim === 768) {
            this.convert = get768Vector;
        } else throw new Error('호환되지 않는 차원');
    }

    async init() {
        if (!this.db) {
            this.db = await getVectorDB(this.dim);
        }
        return this;
    }

    async addRecord(input) {
        const vector = await this.convert(input);
        const record = {
            id: 0,
            sentence: input,
            vector
        };

        await this.db.add(record);
    }

    async removeRecord(id) {
        await this.db.removeById(id);
    }

    async findRecord(sentence, k = 5) {

        const queryVec = await this.convert(sentence);

        const results = await this.db.knn(queryVec, k);

        console.log('위치 findRecord' + results)
        
        return results.map(({ id, sentence, score }) => ({ id, sentence }))
    }
}
