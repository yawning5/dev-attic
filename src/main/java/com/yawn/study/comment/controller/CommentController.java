package com.yawn.study.comment.controller;

import com.yawn.study.comment.dto.CommentEditDto;
import com.yawn.study.comment.dto.CommentPostDto;
import com.yawn.study.comment.dto.CommentResponseDto;
import com.yawn.study.comment.service.CommentService;
import com.yawn.study.security.dto.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@Controller
@RequestMapping("/board/{boardId}/comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<CommentResponseDto> postComment(@PathVariable("boardId") long boardId,
                                                          @RequestBody CommentPostDto commentPostDto,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {

        CommentResponseDto commentResponseDto =
                commentService.commentPost(boardId, userDetails.getUsername(), commentPostDto);

        URI location = URI.create("/board/" + boardId + "/comment/" + commentResponseDto.getId());

        return ResponseEntity
                .created(location)
                .body(commentResponseDto);
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> editComment(@PathVariable("boardId") long boardId,
                                                          @PathVariable("commentId") long commentId,
                                                          @RequestBody CommentEditDto commentEditDto,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        CommentResponseDto commentResponseDto =
                commentService.commentEdit(boardId, commentId, userDetails.getUsername(), commentEditDto);

        return ResponseEntity
                .ok(commentResponseDto);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable("commentId") long commentId,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        commentService.commentDelete(commentId, userDetails.getUsername());

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
