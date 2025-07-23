export const Node = (data, prev = null, next = null) => ({
    data,
    prev,
    next
})

export class LinkedList {
    head;
    tail;
    length;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(data) {
        const node = Node(data);
        if (this.length === 0) {
            node.prev = this.tail;
            this.tail.next = node;
        } else {
            this.head = node;
        }
        this.tail = node;
        this.length++;
    }

    insert(data, at) {
        if (at > this.length) {
            throw new Error(`추가하려는 위치는 ${this.length} 보다 클 수 없습니다`)
        } else if (at === this.length) {
            this.append(data);
        }
    }
}