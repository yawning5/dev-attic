import { VectorDB } from "./VectorDB.js";
import { VectorService } from "./VectorService.js";

let dbInstance = null;
let serviceInstance = null;

export async function getVectorDB(dim, baseDir = 'challenge/ch16~17', fsModule) {
    if (dbInstance) {
        return dbInstance;
    }
    dbInstance = await new VectorDB(dim, baseDir, fsModule).init();
    return dbInstance;
}

export async function getVectorService(dim) {
    if (serviceInstance) {
        return serviceInstance;
    }
    serviceInstance = await new VectorService(dim).init();
    return serviceInstance;
    
}