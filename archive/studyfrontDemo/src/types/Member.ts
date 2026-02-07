export interface Member {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
}

export interface MyPageBoard {
    id: number;
    title: string;
    content: string;
    nickname: string;
}

export interface MyPageComment {
    id: number;
    boardId: number;
    content: string;
    nickname: string;
    createdAt: string;
}

export interface MemberInfo {
    email: string; 
    nickname: string;
    boards?: MyPageBoard[];
    comments?: MyPageComment[];
}
