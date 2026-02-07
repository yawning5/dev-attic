import type { Comment } from './Comment'; // 타입정의시 다른 타입이 필요할 경우 import

export interface Board {
    id: number;
    title: string;
    nickname: string;
    commentCount: number;
    content?: string;
    comments?: Comment[]; // 상세 조회 시만 포함됨
}

export interface BoardWriteInput {
    title: string;
    content: string;
}