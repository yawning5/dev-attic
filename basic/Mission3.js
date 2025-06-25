const books = [
    { title: "Great", outOfPrint: true, category: "Novel", rating: 3.1, volume: 2, start: 197001, end: 198104 },
    { title: "Laws", outOfPrint: true, category: "Novel", rating: 4.8, volume: 3, start: 198006, end: 198507 },
    { title: "Dracula", outOfPrint: true, category: "Drama", rating: 2.3, volume: 6, start: 199105, end: 199605 },
    { title: "Mario", outOfPrint: true, category: "Drama", rating: 3.8, volume: 4, start: 200109, end: 201211 },
    { title: "House", outOfPrint: false, category: "Magazine", rating: 4.4, volume: 1, start: 198707, end: 202507 },
    { title: "Art1", outOfPrint: true, category: "Design", rating: 4.2, volume: 2, start: 198506, end: 199107 },
    { title: "Art2", outOfPrint: true, category: "Design", rating: 3.0, volume: 3, start: 199502, end: 200512 },
    { title: "Wars", outOfPrint: true, category: "Novel", rating: 4.6, volume: 2, start: 198204, end: 200305 },
    { title: "Solo", outOfPrint: false, category: "Poem", rating: 4.9, volume: 2, start: 200703, end: 202507 },
    { title: "Lost", outOfPrint: false, category: "Web", rating: 3.2, volume: 8, start: 199806, end: 202507 },
    { title: "Ocean", outOfPrint: true, category: "Magazine", rating: 4.3, volume: 1, start: 200502, end: 202006 }
];


/**
 * books 중 stock(수량) 이상의 volume 이 있는 객체만 반환
 * @param {Object[]} books 판매 목록
 * @param {number} stock 수량
 * @returns {Object[]} volume이 stock 이상인 책 객체들의 배열
 */
function filterStock(books, stock) {
    return books.filter(
        book => book.volume >= stock
    );
}

/**
 * books 중 term(기간)이 start 와 end 사이에 있는 객체만 반환
 * @param {Object[]} books 판매 목록
 * @param {string} term 기간 
 * @returns {Object[]} 기간 조건에 맞는 책 객체들의 배열
 */
function filterTerm(books, term) {
    return books.filter(
        // book => book.start <= Number(term) <= book.end
        book => book.start <= Number(term) && +term <= book.end
    );
}

/**
 * "Lost(Web) 3.2", "Laws*(Novel) 4.8, Wars*(Novel) 4.6" 포맷으로 변경
 * @param {Object[]} books 판매 목록
 * @returns 정답형식에 맞는 포맷에 맞춰 반환
 */
function resultFormat(books) {
    // return books
    //     .map(book => book.title +
    //         (book.outOfPrint ? "*" : "") +
    //         "(" + book.category + ") " +
    //         book.rating)
    //     .join(", ");

    return books
    .map(book => `${book.title}${book.outOfPrint ? "*" : ""}(${book.category}) ${book.rating}`)
    .join(", ");
}

/**
 * 
 * @param {string} param0 특정 시점
 * @param {number} param1 구매 수량
 */
function find(param0, param1) {
    const purchasable =
        filterStock(filterTerm(books, param0), param1)
            // sort 는 filterStock 을 통과한 books 배열의 객체를 인자로 받는 상황
            // 즉 (a, b) 에서 각 a, b 는 객체 한개임
            .sort((a, b) => b.rating - a.rating);

    if (purchasable.length === 0) return "!EMPTY";

    return resultFormat(purchasable);
}

let param0;
let param1

param0 = "198402"
param1 = 2
console.log("start\n", find(param0, param1), "\nend\n")

param0 = "200008"
param1 = 6
console.log("start\n", find(param0, param1), "\nend\n")

param0 = "199004"
param1 = 3
console.log("start\n", find(param0, param1), "\nend\n")