package com.yawn.study.comment.mapper;

import com.yawn.study.comment.dto.CommentEditDto;
import com.yawn.study.comment.dto.CommentPostDto;
import com.yawn.study.comment.dto.CommentResponseDto;
import com.yawn.study.comment.entity.Comment;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    Comment toComment(CommentPostDto commentPostDto);

    Comment toComment(CommentEditDto commentEditDto);

    @Mapping(target = "nickname", source = "member.nickname")
    @Mapping(target = "boardId", source = "board.id")
    CommentResponseDto commentToCommentResponseDto(Comment comment);

//    /*
//    Mapper 가 list 관련 매핑은 제대로 하지 못하는 경우가 있다고 하여 변경
//     */
//    default List<CommentResponseDto> commentsToCommentResponseDtos(List<Comment> comments) {
//        return comments.stream()
//                .map(this::commentToCommentResponseDto)
//                .collect(Collectors.toList());
//    }

    List<CommentResponseDto> commentsToCommentResponseDtos(List<Comment> comments);

}
