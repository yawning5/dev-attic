import { Node, LinkedList } from "./ch8.js";

// append 메서드 테스트
describe("LinkedList - append", () => {
  test("빈 리스트에 append 하면 head와 tail이 모두 그 노드가 된다", () => {
    const list = new LinkedList();
    list.append(100);

    expect(list.head).not.toBeNull();
    expect(list.tail).not.toBeNull();
    expect(list.head.data).toBe(100);
    expect(list.tail.data).toBe(100);
    expect(list.head).toBe(list.tail); // head, tail이 같은 노드
  });

  test("여러 번 append 하면 tail이 새 노드가 되고, prev/next가 연결된다", () => {
    const list = new LinkedList();
    list.append(1);
    list.append(2);
    list.append(3);

    // 리스트: 1 <-> 2 <-> 3
    expect(list.head.data).toBe(1);
    expect(list.tail.data).toBe(3);

    // head <-> next 연결 확인
    expect(list.head.next.data).toBe(2);
    expect(list.head.next.next.data).toBe(3);
    expect(list.tail.prev.data).toBe(2);

    // tail의 next는 항상 null
    expect(list.tail.next).toBeNull();
  });
});