import { pipeline } from '@xenova/transformers';
/**
 * 
 * @param {*} input 
 * @returns 384 길이의 벡터값
 */
export async function get384Vector(input) {
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const tensor = await extractor(input);

    return extractVector(tensor); 
}

/**
 * 
 * @param {*} input 
 * @returns 768 길이의 벡터값
 */
export async function get768Vector(input) {
    const extractor = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
    const tensor = await extractor(input);

    // console.log('🔍 tensor.dims from 768 model:', tensor.dims);  // 👈 여기 찍어보기

    return extractVector(tensor);
}

/**
 * tensor 를 받아 비교가능한 벡터값 반환
 * @param {*} tensor 
 * @returns 
 */
function extractVector(tensor) {
    const [batch, tokens, dim] = tensor.dims;
    const data = tensor.data;

    const mean = Array(dim).fill(0);

    // 모든 토큰에서 해당 인덱스 값을 더함
    // mean[0] = [CLS] 0번째 값 + hello 0번째 값 + ... + [SEP] 0번째 값
    for (let i = 0; i < tokens; i++) {
        for (let j = 0; j < dim; j++) {
            mean[j] += data[i * dim + j];
        }
    }

    // mean 요소를 tokens 의 숫자로 나누어 평균값 계산
    for (let j = 0; j < dim; j++) {
        mean[j] /= tokens;
    }

    return mean;
}
