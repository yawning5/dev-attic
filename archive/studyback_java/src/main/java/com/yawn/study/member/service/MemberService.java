package com.yawn.study.member.service;

import com.yawn.study.board.entity.Board;
import com.yawn.study.board.repository.BoardRepository;
import com.yawn.study.comment.entity.Comment;
import com.yawn.study.comment.repository.CommentRepositroy;
import com.yawn.study.member.dto.MemberPostDto;
import com.yawn.study.member.dto.MemberResponseDto;
import com.yawn.study.member.dto.MyPageResponseDto;
import com.yawn.study.member.entity.Member;
import com.yawn.study.member.exception.EmailAlreadyExistsException;
import com.yawn.study.member.mapper.MemberMapper;
import com.yawn.study.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@Transactional
public class MemberService {

    private final MemberMapper memberMapper;
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CommentRepositroy commentRepositroy;
    private final BoardRepository boardRepository;

    public MemberService(MemberRepository memberRepository,
                         MemberMapper memberMapper,
                         BCryptPasswordEncoder passwordEncoder,
                         CommentRepositroy commentRepositroy,
                         BoardRepository boardRepository) {
        this.memberRepository = memberRepository;
        this.memberMapper = memberMapper;
        this.passwordEncoder = passwordEncoder;
        this.commentRepositroy = commentRepositroy;
        this.boardRepository = boardRepository;
    }

    public MemberResponseDto createMember(MemberPostDto memberPostDto) {
        log.info("멤버 서비스, createMember 시작");
        log.info("요청자 이메일: " + memberPostDto.getEmail());
        memberPostDto.setEncodePassword(passwordEncoder.encode(memberPostDto.getPassword()));

        Member member = memberMapper.toMember(memberPostDto);
        log.info("매퍼 구동 확인: " + member.getEmail());

        verifyExistEmail(member);

        memberRepository.save(member);

        MemberResponseDto memberResponseDto = new MemberResponseDto();
        memberResponseDto.setId(member.getId());
        memberResponseDto.setNickname(member.getNickname());
        return memberResponseDto;
    }

    public MyPageResponseDto getMyPage(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원"));

        List<Board> boards = boardRepository.findAllByMemberIdWithMember(member.getId());

        List<Comment> comments = commentRepositroy.findAllCommentsByMemberID(member.getId());

        MyPageResponseDto myPageResponseDto = memberMapper.toMyPageResponseDto(member, comments, boards);

        return myPageResponseDto;
    }

    public void deleteMember(String email) {
        Member member = memberRepository.findByEmail(email)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원"));

        memberRepository.deleteById(member.getId());
    }

    public void verifyExistEmail(Member member) {
        Optional<Member> findMember = memberRepository.findByEmail(member.getEmail());
        if (findMember.isPresent()) throw new EmailAlreadyExistsException("이미 사용중인 이메일 입니다: " + member.getEmail());
    }
}
