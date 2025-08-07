import { goodsList, addGoods, buyGoods, getCatalog } from './productHandler.js';
import { jest, test } from '@jest/globals';

function reset(seed = []) {
    goodsList.length = 0;
    goodsList.push(...seed);
}

describe('상품 로직 (productHandler', () => {
    beforeEach(() => {
        reset(
            Array.from({ length: 15 }, (_, i) => ({
                id: i + 1,
                name: `item${i + 1}`,
                stock: 5
            }))
        )
    })

    test('addGoods : 기존 상품 stock 증가', () => {
        const msg = addGoods('1 item1 3');
        expect(msg).toBe('1 item1 total = 8');
        expect(goodsList[0].stock).toBe(8);
    });

    test('addGoods : 신규 상품 추가', () => {
        const msg = addGoods('20 banana 7');
        expect(msg).toBe('20 banana total = 7');
        expect(goodsList.find(p => p.name === 'banana').stock).toBe(7);
    });

    test('buyGoods : 정상 구매', () => {
        const msg = buyGoods('1 2');
        expect(msg).toBe('1 item1 *2 purchased');
        expect(goodsList[0].stock).toBe(3);
    });

    test('buyGoods : 재고 부족 throw', () => {
        expect(() => buyGoods('1 99')).toThrow('재고 부족');
    });

    test('getCatalog : 15개 미만 throw', () => {
        reset(goodsList.slice(0, 10));
        expect(() => getCatalog()).toThrow('상품갯수가 모자랍니다');
    });
})