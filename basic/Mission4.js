class HashMap {

    primBuckets;
    #primSize;
    objBuckets;
    #objSize;

    constructor(size = 16) {
        this.primBuckets = Array.from({ length: size }, () => []);
        this.objBuckets = new WeakMap();
        this.#primSize = 0;
        this.#objSize = 0;
    }

    #hashKey(key, size) {

        let hashedKey = 0;
        const strKey = String(key);

        for (const ch of strKey.split('')) {
            hashedKey = (hashedKey * 31 + ch.charCodeAt(0)) >>> 0;
        }

        return hashedKey % size;
    }

    #rehash() {
        const newSize = this.primBuckets.length * 2;
        const newBuckets = Array.from({ length: newSize }, () => [])

        // 기존 모든 버킷의 데이터를 새 버킷에 이관
        for (const bucket of this.primBuckets) {
            for (const [key, value] of bucket) {
                const idx = this.#hashKey(key, newSize); // 새 크기로 해싱
                newBuckets[idx].push([key, value]);
            }
        }
        this.primBuckets = newBuckets
    }

    clear() {
        this.primBuckets = Array.from({ length: this.primBuckets.length }, () => []);
        this.objBuckets = new WeakMap();
        this.#objSize = 0;
        this.#primSize = 0;
    }

    containsKey(str) {
        const idx = this.#hashKey(str, this.primBuckets.length);
        const bucket = this.primBuckets[idx];

        for (const arr of bucket) {
            if (arr[0] === str) return true;
        }

        return false;
    }

    get(str) {
        const idx = this.#hashKey(str, this.primBuckets.length);
        const bucket = this.primBuckets[idx];

        for (const arr of bucket) {
            if (arr[0] === str) return arr[1];
        }

        return null;
    }

    isEmpty() {
        return (this.#primSize + this.#objSize) === 0;
    }

    keys() {
        const keyList = [];

        for (const arr of this.primBuckets) {
            for (const data of arr) {
                keyList.push(data[0]);
            }
        }
        return keyList;
    }

    put(k, v) {

        // js 에서는 null 도 object 타입으로 출력 됨
        if (typeof k === "object") {
            console.error("object key 는 구현 x");
            return ;
        }
        const idx = this.#hashKey(k, this.primBuckets.length);
        const bucket = this.primBuckets[idx];

        for (const arr of bucket) {
            if (arr[0] === k) {
                arr[1] = v;
                return;
            }
        }

        if (this.#primSize + 1 > this.primBuckets.length * 0.7) {
            this.#rehash();
            const newIdx = this.#hashKey(k, this.primBuckets.length);
            this.primBuckets[newIdx].push([k, v]);
        } else {
            bucket.push([k, v]);
        }
        this.#primSize++;
    }

    remove(k) {
        const idx = this.#hashKey(k, this.primBuckets.length);
        const bucket = this.primBuckets[idx];
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === k) {
                bucket.splice(i, 1);
                this.#primSize--;
                break;
            }
        }
    }

    size() {
        return this.#primSize + this.#objSize;
    }
}

const testMap = new HashMap();

testMap.put("a", 1);
testMap.put("b", 2);

console.log(testMap.get("a"));      
console.log(testMap.containsKey("b")); 
console.log(testMap.size());         

testMap.remove("a");
console.log(testMap.get("a"));       
console.log(testMap.size());         

testMap.clear();
console.log(testMap.isEmpty());     

testMap.put("b", 4)
console.log(testMap.get("b"));

testMap.put(4, 123)
console.log(testMap.get(4))