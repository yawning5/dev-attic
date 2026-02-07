package com.codestates.member.mapper;

import com.codestates.member.dto.MemberDto;
import com.codestates.member.dto.MemberPatchDto;
import com.codestates.member.dto.MemberPostDto;
import com.codestates.member.dto.MemberResponseDto;
import com.codestates.member.entity.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    Member memberPostDtoToMember(MemberDto.Post requestBody);
    Member memberPatchDtoToMember(MemberDto.Patch requestBody);

    @Mapping(source = "stamp.stampCount", target = "stampCount")
    @Mapping(source = "memberStatus.status", target = "memberStatus")  // enum 전달이 좋은가, human readable한 값 전달이 좋은가?
    MemberDto.Response memberToMemberResponseDto(Member member);
    List<MemberDto.Response> membersToMemberResponseDtos(List<Member> members);
}
