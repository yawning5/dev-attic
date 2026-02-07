package com.yawn.study.member.dto;

import com.yawn.study.board.dto.MyPageBoardResponseDto;
import com.yawn.study.comment.dto.CommentResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyPageResponseDto {

    private String nickname;
    private String email;
    private List<MyPageBoardResponseDto> boards;
    private List<CommentResponseDto> comments;

}
