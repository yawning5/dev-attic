import { VectorDB } from "./VectorDB.js";
import { VectorService } from "./VectorService.js";

let dbInstance = null;
let serviceInstance = null;
let serviceDim = null;

export async function getVectorDB(dim, baseDir = 'challenge/ch16~17', fsModule) {
    if (dbInstance) {
        return dbInstance;
    }
    dbInstance = await new VectorDB(dim, baseDir, fsModule).init();
    return dbInstance;
}

export async function getVectorService(dim) {
    if (serviceInstance) {
        if (dim !== serviceDim) {
            throw new Error(
                `이미 dim=${serviceDim}으로 초기화된 VectorService가 있습니다. dim=${dim}으로 다시 생성할 수 없습니다.`
            );
        }
        return serviceInstance;
    }

    serviceInstance = await new VectorService(dim).init();
    serviceDim = dim;
    return serviceInstance;
}