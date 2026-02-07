import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor(private readonly prisma: PrismaService) {}

    // 댓글 목록 (특정 게시글에 대한)
    async findAllByPostId(postId: number) {
        return this.prisma.comment.findMany({ 
            where: { postId },
            include: { author: {
                select: { id: true, email: true } 
            } },
            orderBy: { createdAt: 'desc' },
        });
    }

    // 댓글 작성
    async create(postId: number, authorId: number, content: string) {
        return this.prisma.comment.create({
            data: {
                postId,
                authorId,
                content,
            },
        });
    }

    // 댓글 수정 (본인만)
    async update(id: number, userId: number, content:string) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new ForbiddenException('You can only update your own comments');
        }
        return this.prisma.comment.update({
            where: { id },
            data: { content },
        });
    }

    // 댓글 삭제 (본인만)
    async delete(id: number, userId: number) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new ForbiddenException('You can only delete your own comments');
        }
        return this.prisma.comment.delete({ where: { id } });
    }
}

