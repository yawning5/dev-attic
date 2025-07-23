export const Node = (data, prev = null, next = null) => ({
    data,
    prev,
    next
})

function findTargetNode(newList, at) {
    let curNode = newList.head;
    for (let i = 0; i < at; i++) {
        curNode = curNode.next;
    }
    return curNode;
}

export const createLinkedList = () => ({
    head: null,
    tail: null,
    length: 0
})

const deepCloneList = (list) => {
    const newList = createLinkedList();
    if (!list.head) return newList;

    let oldNode = list.head;
    let prevNode = null;
    while (oldNode) {
        const newNode = Node(oldNode.data)
        if (!newList.head) newList.head = newNode;
        if (prevNode) {
            prevNode.next = newNode;
            newNode.prev = prevNode;
        }
        prevNode = newNode;
        oldNode = oldNode.next;
        newList.length += 1;
    }
    newList.tail = prevNode;
    return newList;
}

export function append(list, data) {
    const newList = deepCloneList(list);
    const node = Node(data);

    if (newList.length === 0) {
        newList.head = node;
    } else {
        node.prev = newList.tail;
        newList.tail.next = node;
    }

    newList.tail = node;
    newList.length += 1;
    return newList;
}

export function insert(list, data, at) {
    if (at < 0 || at > list.length) {
        throw new Error(`삽입 위치는 0 이상 ${list.length} 이하이어야 합니다`);
    }

    if (at === list.length) return append(list, data);

    const newList = deepCloneList(list);
    const node = Node(data);

    if (at === 0) {
        node.next = newList.head;
        newList.head.prev = node;
        newList.head = node;
        newList.length++;
        return newList;
    }

    const curNode = findTargetNode(newList, at);

    // 이전 노드의 다음 노드는 새로운 노드가 된다
    curNode.prev.next = node;
    // 새로운 노드는 현재 노드의 prev, next 를 이어받는다
    node.prev = curNode.prev;
    node.next = curNode;
    // 현재 노드의 이전 노드가 새로운 노드가 된다
    curNode.prev = node;
    newList.length++;

    return newList;
}

export function remove(list, at) {
    if (at < 0 || at >= list.length) {
        throw new Error(`삭제 위치는 0 이상 ${list.length} 미만이어야 합니다`);
    }
    const newList = deepCloneList(list);

    if (list.length === 1 && at === 0) {
        return createLinkedList();
    }

    if (at === 0) {
        newList.head = newList.head.next;
        newList.head.prev = null;
        newList.length--;
        return newList;
    }

    if (at === list.length - 1) {
        newList.tail = newList.tail.prev;
        newList.tail.next = null;
        newList.length--;
        return newList;
    }

    const curNode = findTargetNode(newList, at);

    curNode.prev.next = curNode.next
    curNode.next.prev = curNode.prev

    newList.length--;

    return newList;
}

export function item(list, at) {
    if (at < 0 || at >= list.length) {
        throw new Error(`조회 위치는 0 이상 ${list.length} 미만 이여야 합니다`)
    }

    return findTargetNode(list, at).data;
}

export function clear() {
    return createLinkedList();
}

// ---

export const hashedKey = (key, length) => {
    let h = 0;
    for (const ch of String(key)) {
        h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    }
    return h % length;
}

export const createHashMap = (bucketSize = 16, hashFn = hashedKey) => ({
    buckets: Array.from({ length: bucketSize }, () => createLinkedList()),
    length: 0,
    hashFn
})

const deepCloneMap = (map) => ({
    buckets: map.buckets.map((b) => deepCloneList(b)),
    length: map.length,
    hashFn: map.hashFn
});

export function put(map, k, v) {
    const newMap = deepCloneMap(map);
    const idx = newMap.hashFn(k, newMap.buckets.length);
    const bucket = newMap.buckets[idx];

    let node = bucket.head;
    while (node) {
        if (node.data.k === k) {
            node.data = { k, v }
            return newMap;
        }
        node = node.next;
    }

    newMap.buckets[idx] = append(bucket, { k , v });
    newMap.length++;
    return newMap;
}

export function get(map, k) {
    const idx = map.hashFn(k, map.buckets.length);
    const bucket = map.buckets[idx];

    let node = bucket.head;
    while (node) {
        if (node.data.k === k) {
            return node.data.v;
        }
        node = node.next;
    }

    throw new Error (`존재하지 않는 key 입니다.`)
}

export function contains(map, k) {
    const idx = map.hashFn(k, map.buckets.length);
    const bucket = map.buckets[idx];

    let node = bucket.head;
    while (node) {
        if (node.data.k === k) {
            return true;
        }
        node = node.next;
    }

    return false;
}

export function hashRemove(map, k) {
    const newMap = deepCloneMap(map);
    const idx = newMap.hashFn(k, newMap.buckets.length);
    const bucket = newMap.buckets[idx];

    let node = bucket.head;
    let at = 0;
    while(node) {
        if (node.data.k === k) {
            newMap.buckets[idx] = remove(bucket, at);
            newMap.length--;
            break;
        }
        node =node.next;
        at++;
    }

    return newMap;
}

export function keys(map) {
    const arr = [];

    if (map.length === 0) {
        return arr;
    }
    
    for (const bucket of map.buckets) {
        let curNode = bucket.head;
        while(curNode) {
            arr.push(curNode.data.k);
            curNode = curNode.next;
        }
    }

    return arr;
}
