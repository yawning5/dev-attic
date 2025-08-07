export const goodsList = [
    { id: 1, name: '무선 마우스', stock: 25 },
    { id: 2, name: '유선 키보드', stock: 40 },
    { id: 3, name: '게이밍 모니터', stock: 10 },
    { id: 4, name: 'USB C타입 케이블', stock: 100 },
    { id: 5, name: '노트북 거치대', stock: 15 },
    { id: 6, name: '외장 SSD 1TB', stock: 8 },
    { id: 7, name: '블루투스 스피커', stock: 12 },
    { id: 8, name: '책상 조명', stock: 18 },
    { id: 9, name: '웹캠 1080p', stock: 22 },
    { id: 10, name: '마이크 스탠드', stock: 13 },
    { id: 11, name: '헤드셋', stock: 30 },
    { id: 12, name: 'HDMI 케이블', stock: 55 },
    { id: 13, name: '노트북 백팩', stock: 17 },
    { id: 14, name: '무선 충전기', stock: 20 },
    { id: 15, name: '기계식 키보드', stock: 7 },
    { id: 16, name: '그래픽 타블렛', stock: 5 },
    { id: 17, name: '스마트폰 거치대', stock: 33 },
    { id: 18, name: '랜선 10m', stock: 42 }
];

export function addGoods(sock, content) {
    console.log(content);
    const [id, name, count] = content.split(' ');

    let product = goodsList.find(n => n.name === name);
    if (!product) {
        product = {
            id: goodsList.length + 1,
            name: name,
            stock: count
        };
        goodsList.push(product);
    } else if (product) {
        product.stock = product.stock + count;
    }

    return (`${id} ${name} total = ${product.stock}`);
}

export function buyGoods(sock, content) {
    const [id, count] = content.split(' ');
    const product = goodsList.find(n => n.id === +id);
    if (!product) throw new Error(`없는 상품`);
    if (product.stock < count) throw new Error(`재고 부족`);

    product.stock = product.stock - count;
    return (`${id} ${product.name} *${count} purchased`);
}

export function getCatalog(sock) {
    if (goodsList.length < 15) throw new Error (`error 상품갯수가 모자랍니다`);
    return (`items are ${JSON.stringify(goodsList, null, 2)}`);
}

