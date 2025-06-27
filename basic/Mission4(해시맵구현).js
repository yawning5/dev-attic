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

    /**
     * 해시맵 키를 인덱스로 변환하는 해싱 함수
     * @param {*} key - 프리미티브 타입의 키 (object 아님)
     * @param {number} length - 현재 primBuckets 배열의 길이
     * @returns {number} - 해시된 인덱스 (0 이상 length 미만의 정수)
     */
    #hashKey(key, length) {

        let hashedKey = 0;
        const strKey = String(key);

        for (const ch of strKey.split('')) {
            hashedKey = (hashedKey * 31 + ch.charCodeAt(0)) >>> 0;
        }

        return hashedKey % length;
    }

    /**
     * 해시맵의 크기를 기존 크기의 2배로 하고
     * 기존 데이터들을 새 버킷에 새 크기로 해싱해서 옮겨담음
     */
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

    /**
     * 해시맵 내용물을 지웁니다
     */
    clear() {
        this.primBuckets = Array.from({ length: this.primBuckets.length }, () => []);
        this.objBuckets = new WeakMap();
        this.#objSize = 0;
        this.#primSize = 0;
    }

    /**
     * str 이 키 값으로 존재하는지 여부 탐색
     * @param {*} str - 조회할 키 (프리미티브 타입)
     * @returns {boolean} - 포함시 true, 없을시 false
     */
    containsKey(str) {
        const idx = this.#hashKey(str, this.primBuckets.length);
        const bucket = this.primBuckets[idx];

        for (const arr of bucket) {
            if (arr[0] === str) return true;
        }

        return false;
    }

    /**
     * 키에 바인딩된 값을 반환
     * @param {*} str - 조회할 키 (프리미티브 타입)
     * @returns - 값이 있다면 값을 반환, 없다면 null
     */
    get(str) {
        const idx = this.#hashKey(str, this.primBuckets.length);
        const bucket = this.primBuckets[idx];

        for (const arr of bucket) {
            if (arr[0] === str) return arr[1];
        }

        return null;
    }

    /**
     * 데이터가 있는지 확인하고 boolean 반환
     * @returns {boolean} - 데이터가 있다면 true, 없다면 false
     */
    isEmpty() {
        return (this.#primSize + this.#objSize) === 0;
    }

    /**
     * 키 리스트 문자배열 반환
     * @returns {string[]} - 키가 담긴 문자열 배열 반환
     */
    keys() {
        const keyList = [];

        for (const arr of this.primBuckets) {
            for (const data of arr) {
                keyList.push(data[0]);
            }
        }
        return keyList;
    }

    /**
     * [k, v] 데이터 추가
     * @param {*} k - 추가할 키 (프리미티브 타입)
     * @param {*} v - 추가할 값
     * @returns - obj 값은을 키로 넣으면 오류로그 반환
     */
    put(k, v) {

        // js 에서는 null 도 object 타입으로 출력 됨
        if (typeof k === "object") {
            console.error("object key 는 구현 x");
            return;
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

    /**
     * 해당 키를 가진 데이터 삭제
     * @param {*} k - 제거할 데이터의 키 (프리미티브 타입)
     */
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

    /**
     * HashMap 안의 데이터 갯수 반환
     * @returns - 데이터 총 갯수 반환
     */
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