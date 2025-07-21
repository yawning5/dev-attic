import { Thanos } from "./Thanos.js";

class Board {

    newBoard = [
        ['A', []],
        ['B', []],
        ['C', []],
        ['D', []],
        ['E', []],
    ]

    #comBoard;

    constructor() {
        this.userBoard = new Map(this.newBoard);
        this.#comBoard = new Map(this.newBoard);
        this.totalHP = 'HP = ' + 1;
    }

    display() {
        console.log(this.totalHP);
        
        const rows = Array.from(this.userBoard.keys());
        const colCount = 6;

        // 상단 열 번호
        let header = ' |';
        for (let i = 1; i <= colCount; i++) {
            header += String(i).padStart(2, '0') + '|';
        }
        console.log(header);
        
        // 각 행 출력
        for (const row of rows) {
            let line = row + '|';
            const cells = this.userBoard.get(row);
            for (let i = 0; i < colCount; i++) {
                const v = (() => {
                    if (cells[i] === undefined) {
                        return '..';
                    } else if (cells[i] instanceof Thanos) {
                        return 2;
                    } else {
                        return cells[i];
                    }
                })();
                line += v.toString().padEnd(2, ' ') + '|';
            }
            console.log(line);
        }

        // 하단 열 번호
        console.log(header);
    }
}

const board = new Board();
board.display();