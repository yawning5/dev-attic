package com.yawn.study.board.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyPageBoardResponseDto {
    private Long id;
    private String title;
    private String content;
    private String nickname;
}
