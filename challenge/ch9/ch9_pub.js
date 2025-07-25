function createListenerRecord({ subscriber, eventName, sender, emitterType, handler, id }) {
  return {
    id,
    subscriber,
    subscriberId: ensureId(subscriber),
    eventName,
    sender,
    senderId: sender ? ensureId(sender) : null,
    emitterType,   // 'sync' | 'async' | 'delay'
    handler
  };
}

// 이 OBJ_ID 변수를 복사해서 가지고 다녀야
const OBJ_ID = Symbol('obj.id');
let seq = 0;

function ensureId(obj) {
    if (obj == null) {
        return null;
    }
    if (!obj[OBJ_ID]) {
        // 여기 설정한 OBJ_ID 속성을 열람가능
        Object.defineProperty(obj, OBJ_ID, {

        })
    }
}

class EventManager {

    static instance;
    #listeners
    #seq

    constructor() {
        this.#listeners = new Map();
        this.#seq = 0;
    }

    static sharedInstance() {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    add(subscriber, eventName, sender, emitterType, handler) {
        const record = createListenerRecord(
            subscriber, eventName, sender, emitterType, handler, ++this.#seq
        )
    }
}