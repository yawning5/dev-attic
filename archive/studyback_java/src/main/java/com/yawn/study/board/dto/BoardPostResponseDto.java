package com.yawn.study.board.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class BoardPostResponseDto {
    private Long id;
    private String title;
    private String content;
    private String nickname;
    private String email;
}
