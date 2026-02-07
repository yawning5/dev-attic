import { Controller, Get, Post as HttpPost, Patch, UseGuards, Param, Req, Body, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts/:postId/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    // 댓글 목록 (특정 게시글에 대한)
    @Get()
    async getAll(@Param('postId') postId: string) {
        return this.commentService.findAllByPostId(+postId);
    }

    // 댓글 작성 (Jwt 인증 필요)
    @UseGuards(JwtAuthGuard)
    @HttpPost()
    async create(
        @Param('postId') postId: string,
        @Req() req,
        @Body() body: { content: string },
    ) {
        return this.commentService.create(
            Number(postId),
            req.user.id,
            body.content,
        );
    }

    // 댓글 수정 (본인만, Jwt 인증 필요)
    /*
    여기선 postId는 필요하지 않습니다.
    댓글 수정은 댓글 ID로만 식별합니다.
    이유: 댓글 수정은 댓글 자체를 식별하기 때문
    */
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Req() req,
        @Body() body: { content: string },
    ) {
        return this.commentService.update(
            Number(id),
            req.user.id,
            body.content,
        );
    }

    // 댓글 삭제 (본인만, Jwt 인증 필요)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Req() req,
    ) {
        return this.commentService.delete(
            Number(id), 
            req.user.id
        );
    }
}
        
