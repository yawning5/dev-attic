package com.yawn.study.board.dto;

import com.yawn.study.comment.dto.CommentResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BoardResponseDto {
    private Long id;
    private String title;
    private String content;
    private String nickname;
    private List<CommentResponseDto> comments;
}
