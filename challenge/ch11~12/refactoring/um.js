import bus from './bus.js';
import dashBoard from './DashBoard.js';

// ===== [업로드 매니저] =====
class UploadManager {
    #waitQueue;

    static #instance;

    constructor(bus) {
        if (UploadManager.#instance) return UploadManager.#instance;
        UploadManager.#instance = this;
        this.#waitQueue = [];
        this.bus = bus;

        // ===== [이벤트 구독] =====
        this.bus.on('addWaitQueue', (files) => {
            this.addWQ(files);
        });
    }

    getWQ() {
        return this.#waitQueue;
    }

    addWQ(files) {
        for (const file of files) {
            this.#waitQueue.push(file);
        }
        bus.emit('printQueue', this.#waitQueue);
    }
}

const um = new UploadManager(bus);
export default um;