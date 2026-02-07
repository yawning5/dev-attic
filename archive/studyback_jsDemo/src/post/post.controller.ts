import { Controller, Get, Param, Body, Post, Req, UseGuards, Patch, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    // 전체 글 목록 조회
    @Get()
    getAll() {
        return this.postService.findAll();
    }

    // 글 상세
    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.postService.findById(Number(id));
    }

    // 글 작성 (Jwt 인증 필요)
    @UseGuards(JwtAuthGuard)
    @Post()
    createPost(@Req() req, @Body() body: { title: string; content: string }) {
        // req.user.id: JWT 에서 추출한 유저 ID
        return this.postService.create({
            title: body.title,
            content: body.content,
            authorId: req.user.id,
        });
    }

    // 글 수정 (Jwt 인증 필요)
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Req() req,
        @Body() body: { title?: string; content?: string },
    ) {
        return this.postService.update(
            Number(id),
            req.user.id,
            body,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(
        @Param('id') id: string,
        @Req() req,
    ) {
        return this.postService.delete(Number(id), req.user.id
        )
    }
}
