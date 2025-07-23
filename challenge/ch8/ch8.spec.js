import { createLinkedList, append, insert, remove, item, clear } from "./ch8.js";
import { createHashMap, put, get, contains, hashRemove, keys } from "./ch8.js";


describe("functional LinkedList - append", () => {
  test("빈 리스트에 append 하면 head와 tail이 모두 그 노드가 된다", () => {
    let list = createLinkedList();
    list = append(list, 100);

    expect(list.head).not.toBeNull();
    expect(list.tail).not.toBeNull();
    expect(list.head.data).toBe(100);
    expect(list.tail.data).toBe(100);
    expect(list.head).toBe(list.tail);
    expect(list.length).toBe(1);
  });

  test("여러 번 append 하면 tail이 새 노드가 되고 prev/next가 연결된다", () => {
    let list = createLinkedList();
    list = append(list, 1);
    list = append(list, 2);
    list = append(list, 3);

    // 리스트: 1 <-> 2 <-> 3
    expect(list.head.data).toBe(1);
    expect(list.tail.data).toBe(3);

    expect(list.head.next.data).toBe(2);
    expect(list.head.next.next.data).toBe(3);
    expect(list.tail.prev.data).toBe(2);

    // tail의 next는 null
    expect(list.tail.next).toBeNull();
    expect(list.length).toBe(3);
  });
});

describe("functional LinkedList - insert", () => {
  let list;
  beforeEach(() => {
    list = createLinkedList();
  });

  test("빈 리스트에 insert(10, 0)하면 head/tail이 10이 된다", () => {
    list = insert(list, 10, 0);
    expect(list.head.data).toBe(10);
    expect(list.tail.data).toBe(10);
    expect(list.length).toBe(1);
  });

  test("append와 insert(value, length)는 동일하다", () => {
    list = append(list, 1);
    list = append(list, 2);

    const withInsert = insert(list, 3, list.length); // [1,2] → [1,2,3]
    const withAppend = append(list, 3);

    expect(withInsert.tail.data).toBe(3);
    expect(withInsert.head.next.next.data).toBe(3);
    expect(withInsert.length).toBe(3);

    // 불변성 확인: append 사용 전의 list는 여전히 길이 2
    expect(list.length).toBe(2);
    // 두 결과 리스트 구조가 동일
    expect(withInsert.head.data).toBe(withAppend.head.data);
    expect(withInsert.tail.data).toBe(withAppend.tail.data);
  });

  test("중간에 삽입 시 올바른 위치에 들어간다", () => {
    list = append(list, 1); // idx 0
    list = append(list, 2); // idx 1
    list = append(list, 3); // idx 2

    const newList = insert(list, 99, 1); // 1 → 99 → 2 → 3

    expect(newList.head.next.data).toBe(99);
    expect(newList.head.next.prev.data).toBe(1);
    expect(newList.head.next.next.data).toBe(2);
    expect(newList.length).toBe(4);

    // 원본 불변 확인
    expect(list.length).toBe(3);
    expect(list.head.next.data).toBe(2);
  });

  test("맨 앞(head)에 삽입 시 정상동작", () => {
    list = append(list, 2);
    list = append(list, 3);

    const newList = insert(list, 1, 0); // 1 → 2 → 3

    expect(newList.head.data).toBe(1);
    expect(newList.head.next.data).toBe(2);
    expect(newList.length).toBe(3);
  });

  test("잘못된 위치에 삽입 시 예외 발생", () => {
    list = append(list, 1);

    expect(() => insert(list, 2, 5)).toThrow();
    expect(() => insert(list, 2, -1)).toThrow();
  });
});

describe("functional LinkedList - remove", () => {
  let list;
  beforeEach(() => {
    list = createLinkedList();
    list = append(list, 1); // idx 0
    list = append(list, 2); // idx 1
    list = append(list, 3); // idx 2
    list = append(list, 4); // idx 3
    // [1, 2, 3, 4]
  });

  test("맨 앞(head) 노드 삭제", () => {
    const removed = remove(list, 0); // remove 1
    expect(removed.head.data).toBe(2);
    expect(removed.head.prev).toBeNull();
    expect(removed.length).toBe(3);

    // 원본 리스트 불변성
    expect(list.head.data).toBe(1);
    expect(list.length).toBe(4);
  });

  test("중간 노드 삭제", () => {
    const removed = remove(list, 1); // remove 2 (index 1)
    // [1, 3, 4]
    expect(removed.head.data).toBe(1);
    expect(removed.head.next.data).toBe(3);
    expect(removed.head.next.prev.data).toBe(1);
    expect(removed.length).toBe(3);

    // 원본 리스트 불변성
    expect(list.head.next.data).toBe(2);
    expect(list.length).toBe(4);
  });

  test("맨 끝(tail) 노드 삭제", () => {
    const removed = remove(list, 3); // remove 4
    expect(removed.tail.data).toBe(3);
    expect(removed.tail.next).toBeNull();
    expect(removed.length).toBe(3);

    // tail 연결 확인
    expect(removed.head.next.next.data).toBe(3);
    expect(removed.head.next.next.next).toBeNull();

    // 원본 리스트 불변성
    expect(list.tail.data).toBe(4);
    expect(list.length).toBe(4);
  });

  test("유일한 노드 삭제하면 빈 리스트가 된다", () => {
    const single = createLinkedList();
    const singleNode = append(single, 99);

    const removed = remove(singleNode, 0);
    expect(removed.head).toBeNull();
    expect(removed.tail).toBeNull();
    expect(removed.length).toBe(0);
  });

  test("잘못된 위치(음수, 초과) 삭제시 예외 발생", () => {
    expect(() => remove(list, -1)).toThrow();
    expect(() => remove(list, 4)).toThrow(); // 0~3만 존재
  });
});

describe("functional LinkedList - item", () => {
  let list;
  beforeEach(() => {
    list = createLinkedList();
    list = append(list, 10); // idx 0
    list = append(list, 20); // idx 1
    list = append(list, 30); // idx 2
  });

  test("올바른 위치의 값을 정상 반환한다", () => {
    expect(item(list, 0)).toBe(10);
    expect(item(list, 1)).toBe(20);
    expect(item(list, 2)).toBe(30);
  });

  test("음수 위치 조회시 예외 발생", () => {
    expect(() => item(list, -1)).toThrow();
  });

  test("list.length 이상 위치 조회시 예외 발생", () => {
    expect(() => item(list, 3)).toThrow();
    expect(() => item(list, 100)).toThrow();
  });
});

describe("functional LinkedList - clear", () => {
  test("clear()는 항상 새로운 빈 리스트를 반환한다", () => {
    const list = createLinkedList();
    const list2 = append(list, 1);
    const list3 = append(list2, 2);

    const cleared = clear(list3);

    // 빈 리스트인지 확인
    expect(cleared.head).toBeNull();
    expect(cleared.tail).toBeNull();
    expect(cleared.length).toBe(0);

    // 원본 리스트 불변 확인
    expect(list3.length).toBe(2);
    expect(list3.head.data).toBe(1);
    expect(list3.tail.data).toBe(2);
  });

  test("빈 리스트에 clear 해도 빈 리스트 반환", () => {
    const empty = createLinkedList();
    const cleared = clear(empty);

    expect(cleared.head).toBeNull();
    expect(cleared.tail).toBeNull();
    expect(cleared.length).toBe(0);
  });
});

describe("functionalHashMap - put", () => {
    test("빈 맵에 put 하면 새 맵에 (key,value) 저장되고 length 1", () => {
        const map0 = createHashMap();

        const map1 = put(map0, "a", 100);

        // 원본은 불변
        expect(map0.length).toBe(0);

        // 새 맵은 값 포함
        expect(map1.length).toBe(1);
        expect(get(map1, "a")).toBe(100);
    });

    test("같은 키에 put 하면 값만 갱신되고 length는 그대로", () => {
        let map = createHashMap();
        map = put(map, "k", 1);

        const mapUpdated = put(map, "k", 2);

        expect(map.length).toBe(1); // 원본 유지
        expect(mapUpdated.length).toBe(1);
        expect(get(mapUpdated, "k")).toBe(2);
    });

    test("다른 키를 넣으면 length 증가", () => {
        let map = createHashMap();
        map = put(map, "x", 10);

        const map2 = put(map, "y", 20);

        expect(map.length).toBe(1);
        expect(map2.length).toBe(2);
        expect(get(map2, "x")).toBe(10);
        expect(get(map2, "y")).toBe(20);
    });
});

describe("functionalHashMap - contains", () => {
  test("빈 맵은 어떤 키도 포함하지 않는다", () => {
    const map = createHashMap();
    expect(contains(map, "a")).toBe(false);
  });

  test("put 이후에는 해당 키를 포함한다", () => {
    let map = createHashMap();
    map = put(map, "alpha", 1);
    expect(contains(map, "alpha")).toBe(true);
  });

  test("다른 키는 여전히 포함하지 않는다", () => {
    let map = createHashMap();
    map = put(map, "x", 42);
    expect(contains(map, "y")).toBe(false);
  });
});

describe("functionalHashMap - hashRemove", () => {
  test("삭제 결과는 새 Map을 반환하고, 원본은 보존된다", () => {
    let map = createHashMap();
    map = put(map, "a", 1);
    map = put(map, "b", 2);

    const beforeLength = map.length;
    const newMap = hashRemove(map, "a");

    // 원본은 변화 없음
    expect(map.length).toBe(beforeLength);
    expect(contains(map, "a")).toBe(true);

    // 새 맵은 길이 -1, 키 제거됨
    expect(newMap.length).toBe(beforeLength - 1);
    expect(contains(newMap, "a")).toBe(false);
    expect(contains(newMap, "b")).toBe(true);
  });

  test("존재하지 않는 키 삭제 시 길이 동일, 내용 동일", () => {
    let map = createHashMap();
    map = put(map, "x", 10);

    const newMap = hashRemove(map, "not_exist");

    expect(newMap.length).toBe(map.length);
    expect(contains(newMap, "x")).toBe(true);
  });
});

describe("functionalHashMap - keys", () => {
  test("빈 맵의 keys()는 빈 배열을 반환한다", () => {
    const map = createHashMap();
    expect(keys(map)).toEqual([]);
  });

  test("여러 키 삽입 후 keys()가 모든 키를 포함한다", () => {
    let map = createHashMap();
    map = put(map, "a", 1);
    map = put(map, "b", 2);
    map = put(map, "c", 3);

    const result = keys(map);
    expect(result).toHaveLength(3);
    expect(result.sort()).toEqual(["a", "b", "c"]);
  });

  test("같은 키에 값을 덮어쓰면 keys() 길이는 유지된다", () => {
    let map = createHashMap();
    map = put(map, "dup", 1);
    map = put(map, "dup", 2); // 덮어쓰기

    const result = keys(map);
    expect(result).toEqual(["dup"]);
  });

  test("키 삭제 후 keys()에서 사라진다", () => {
    let map = createHashMap();
    map = put(map, "x", 10);
    map = put(map, "y", 20);
    map = hashRemove(map, "x");

    const result = keys(map);
    expect(result).toEqual(["y"]);
  });
});
