package com.yawn.study.comment.service;

import com.yawn.study.board.entity.Board;
import com.yawn.study.board.repository.BoardRepository;
import com.yawn.study.comment.dto.CommentEditDto;
import com.yawn.study.comment.dto.CommentPostDto;
import com.yawn.study.comment.dto.CommentResponseDto;
import com.yawn.study.comment.entity.Comment;
import com.yawn.study.comment.mapper.CommentMapper;
import com.yawn.study.comment.repository.CommentRepositroy;
import com.yawn.study.member.entity.Member;
import com.yawn.study.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class CommentService {

    private final CommentMapper commentMapper;
    private final CommentRepositroy commentRepositroy;
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;

    public CommentService(CommentMapper commentMapper,
                          CommentRepositroy commentRepositroy,
                          MemberRepository memberRepository,
                          BoardRepository boardRepository) {
        this.commentMapper = commentMapper;
        this.commentRepositroy = commentRepositroy;
        this.memberRepository = memberRepository;
        this.boardRepository = boardRepository;
    }

    /**
     * 새로운 댓글(comment)을 DB에 저장합니다.
     * @param boardId 댓글이 속하는 board 객체의 id
     * @param email 댓글을 작성한 user 의 email
     * @param commentPostDto {@link com.yawn.study.comment.dto.CommentPostDto} 저장할 댓글의 내용
     * @return {@link com.yawn.study.comment.dto.CommentResponseDto}
     */
    public CommentResponseDto commentPost(long boardId,
                                          String email,
                                          CommentPostDto commentPostDto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글 존재하지 않음"));

        Comment comment = commentMapper.toComment(commentPostDto);

        comment.connectTo(board, member);

        commentRepositroy.save(comment);

        return commentMapper.commentToCommentResponseDto(comment);
    }

    @Transactional
    public CommentResponseDto commentEdit(long boardId,
                                          long commentId,
                                          String email,
                                          CommentEditDto commentEditDto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글 존재하지 않음"));

        Comment comment = commentRepositroy.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글 존재하지 않음"));

        comment.editComment(commentEditDto.getContent());

        return commentMapper.commentToCommentResponseDto(comment);
    }

    public void commentDelete(long commentId,
                              String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
        Comment comment = commentRepositroy.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글 존재하지 않음"));

        if (!email.equals(comment.getMember().getEmail())) {
            throw new IllegalArgumentException("작성자만 게시글을 삭제할 수 있습니다");
        }

        commentRepositroy.deleteById(commentId);
    }

}
