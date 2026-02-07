package com.yawn.study.board.mapper;

import com.yawn.study.board.dto.BoardListResponseDto;
import com.yawn.study.board.dto.BoardPostDto;
import com.yawn.study.board.dto.BoardPostResponseDto;
import com.yawn.study.board.dto.BoardResponseDto;
import com.yawn.study.board.entity.Board;
import com.yawn.study.comment.mapper.CommentMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CommentMapper.class})
public interface BoardMapper {
    Board toBoard(BoardPostDto boardPostDto);

    @Mapping(target = "nickname", source = "member.nickname")
    @Mapping(target = "email", source = "member.email")
    BoardPostResponseDto toBoardPostResponseDto(Board board);

    @Mapping(target = "nickname", source = "member.nickname")
    @Mapping(target = "commentCount", expression = "java(board.getComments() != null ? board.getComments().size() : 0)")
    BoardListResponseDto toBoardListResponseDto(Board board);

    @Mapping(target = "nickname", source = "member.nickname")
    @Mapping(target = "comments", source = "comments")
    BoardResponseDto toBoardResponseDto(Board board);
}
