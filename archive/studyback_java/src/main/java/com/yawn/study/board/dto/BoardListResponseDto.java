package com.yawn.study.board.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BoardListResponseDto {
    private Long id;
    private String title;
    private String nickname;
    private int commentCount;
}
