package com.yawn.study.member.mapper;

import com.yawn.study.board.entity.Board;
import com.yawn.study.board.mapper.BoardMapper;
import com.yawn.study.comment.entity.Comment;
import com.yawn.study.comment.mapper.CommentMapper;
import com.yawn.study.member.dto.MemberPostDto;
import com.yawn.study.member.dto.MyPageResponseDto;
import com.yawn.study.member.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {BoardMapper.class, CommentMapper.class})
public interface MemberMapper {

    Member toMember(MemberPostDto memberPostDto);

    /*
    Mapper 에 인자가 2개 오면 매퍼가 구분을 못하므로
    명시해줄 필요가 있음
     */
    @Mapping(target = "email", source = "member.email")
    @Mapping(target = "nickname", source = "member.nickname")
    @Mapping(target = "boards", source = "boards")
    @Mapping(target = "comments", source = "comments")
    MyPageResponseDto toMyPageResponseDto(Member member, List<Comment> comments, List<Board> boards);
}
