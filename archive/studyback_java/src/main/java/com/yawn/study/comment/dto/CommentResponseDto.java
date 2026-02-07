package com.yawn.study.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommentResponseDto {
    private Long id;
    private Long boardId;
    private String content;
    private String nickname;
    private LocalDateTime createdAt;
}
