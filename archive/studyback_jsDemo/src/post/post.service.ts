import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(private readonly prisma: PrismaService) {}

    // 전체 게시글 목록 조회
    async findAll() {
        return this.prisma.post.findMany({
            include: {author: {select: {id: true, email: true}}, comments: true},
            orderBy: {createdAt: 'desc'},
        });
    }

    // 단일 글 조회
    async findById(id: number) {
        const post = await this.prisma.post.findUnique({
            where: {id},
            include: {author: {select: {id: true, email: true}}, comments: true},
        });
        if (!post) throw new NotFoundException(`게시글 없음`);
        return post;
    }

    // 게시글 작성
    async create(data: {title: string; content: string; authorId: number}) {
        return this.prisma.post.create({
            data,
        });
    }

    // 게시글 수정 (본인만 가능)
    async update(id: number, userId: number, data: {title?: string; content?: string}) {
        const post = await this.prisma.post.findUnique({where: {id}});
        if (!post) throw new NotFoundException(`게시글 없음`);
        if (post.authorId !== userId) throw new ForbiddenException(`본인만 수정 가능`);
        return this.prisma.post.update({
            where: {id},
            data,
        });
    }

    // 게시글 삭제 (본인만 가능)
    async delete(id: number, userId: number) {
        const post = await this.prisma.post.findUnique({where: {id}});
        if (!post) throw new NotFoundException(`게시글 없음`);
        if (post.authorId !== userId) throw new ForbiddenException(`본인만 삭제 가능`);
        return this.prisma.post.delete({ where: {id} });
    }
}
