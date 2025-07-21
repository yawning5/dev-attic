import { Thanos } from "./Thanos.js";

class Board {

    columns = [
        ['A', []],
        ['B', []],
        ['C', []],
        ['D', []],
        ['E', []],
    ]

    rows = ['A', 'B', 'C', 'D', 'E']

    #comBoard;

    constructor() {
        this.userBoard = new Map(this.columns);
        this.#comBoard = new Map(this.columns);
        this.totalHP = 'HP = ' + 1;
    }

    getComBoard() {
        return this.#comBoard;
    }

    getRowIndex(char) { return this.rows.indexOf(char); }

    getColIndex(num) { return Number(num) - 1; } // 1~6 입력시 0~5로 변환

    getPieceAt(board, pos) {
        const [rowChar, colNum] = pos;
        return board.get(rowChar)[colNum - 1];
    }

    setPieceAt(board, pos, val) {
        const [rowChar, colNum] = pos;
        board.get(rowChar)[colNum - 1] = val;
    }

    isInside(row, col) {
        return row >= 0 && row < 5 && col >= 0 && col < 6;
    }

    /**
     * 
     * @returns {{header: string, lines: string[]}}
     *   header: 상단/하단 열 라벨(문자열)
     *   lines: 각 행의 출력 문자열 배열
     */
    display() {
        console.log(this.totalHP);

        const lines = [];
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
            lines.push(line);
        }

        // 하단 열 번호
        console.log(header);

        return { header, lines }
    }
}

const board = new Board();
board.display();