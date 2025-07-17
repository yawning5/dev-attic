class Simulator {
  constructor() {

    // text 영역에서 몇 번째 명령인지 저장하는 변수
    this.PC = 0;

    // stack 영역에서 메모리가 어디까지 할당 되어있는지 표시하는 변수
    this.StackPointer = 0;

    // 각종 영역/구조체 초기화
    this.text = [];         // TEXT 영역
    this.stack = [];        // STACK 영역
    this.heap = [];         // HEAP 영역
    this.types = {};        // 타입별 크기 저장
    this.funcMap = {};      // 함수명-시작주소 매핑
    this.callStackArr = []; // 함수 호출 스택
    // 추가 필요한 변수들
  }

  /**
   * 함수를 구성하는 어셈블리 코드를 이름과 문자열 배열로 전달
   * TEXT 영역에 0부터 코드를 한 줄씩 배치한다. 최종 위치는 저장하고 있다가 다른 함수를 배치할 때 겹치지 않도록 한다.
   * 함수를 추가할 때마다 함수별 TEXT 주소 위치를 기록한다.
   * @param {*} funcName 
   * @param {*} codes 
   */
  locate(funcName, codes) {}

  /**
   * type 별로 고유한 사이즈를 가지도록 등록한다.
   * 예시 : setSize("INT", 8) // int 타입을 8바이트 길이로 지정한다.
   * 메모리 시뮬레이션을 위해 스스로 필요한 타입을 지정해야 한다.
   * 이미 등록한 타입은 다시 사이즈를 바꿀 수 없다.
   * 사이즈는 1, 2, 4, 8, 16, 32 중에 하나만 가능하다.
   * @param {*} type 
   * @param {*} length 
   */
  setSize(type, length) {}

  pushStack(address) {}

  popStack() {}

  alloc(type, count) {}

  free(stackAddress) {}

  /**
   * [다음]
   */
  nextCode() {}

  usage() {}

  callstack() {}

  heapdump() {}

  garbageCollect() {}

  reset() {}
}
