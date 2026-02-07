package com.codestates.member.service;

import com.codestates.exception.BusinessLogicException;
import com.codestates.exception.ExceptionCode;
import com.codestates.member.entity.Member;
import com.codestates.member.entity.MemberExcludeName;
import com.codestates.member.repository.MemberRepository;
import com.codestates.stamp.Stamp;
import com.codestates.utils.CustomBeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 *  - 메서드 구현
 *  - DI 적용
 *  - Spring Data JPA 적용
 */
@Service
public class MemberService {
    private final MemberRepository memberRepository;
    private final CustomBeanUtils<Member> beanUtils;

    public MemberService(MemberRepository memberRepository, CustomBeanUtils<Member> beanUtils) {
        this.memberRepository = memberRepository;
        this.beanUtils = beanUtils;
    }

    public Member createMember(Member member) {
        // 신규 회원에 대한 Stamp 제공
        initStamp(member); // homework solution 추가

        // 이미 등록된 이메일인지 확인
        verifyExistsEmail(member.getEmail());

        return memberRepository.save(member);
    }

    private void initStamp(Member member) {
        member.setStamp(new Stamp());
    }

    // 리팩토링 전
    public Member updateMemberOld(Member member) {
        Member findMember = findVerifiedMember(member.getMemberId());

        // 수정할 정보들이 늘어나면 반복되는 코드가 늘어나는 문제점이 있음
        Optional.ofNullable(member.getName()).ifPresent(name -> findMember.setName(name));
        Optional.ofNullable(member.getPhone()).ifPresent(phone -> findMember.setPhone(phone));
        // 추가된 부분
        Optional.ofNullable(member.getMemberStatus()).ifPresent(memberStatus -> findMember.setMemberStatus(memberStatus));
//        findMember.setModifiedAt(LocalDateTime.now());

        return memberRepository.save(findMember);
    }

    // 리팩토링 후
    public Member updateMember(Member member) {
        Member findMember = findVerifiedMember(member.getMemberId());

        Member updatedMember = beanUtils.copyNonNullProperties(member, findMember);

        return memberRepository.save(updatedMember);
    }

    public Member findMember(long memberId) {
        return findVerifiedMember(memberId);
    }

    public Page<Member> findMembers(int page, int size) {
        return memberRepository.findAll(PageRequest.of(page, size, Sort.by("memberId").descending()));
    }

    public void deleteMember(long memberId) {
        Member findMember = findVerifiedMember(memberId);

        memberRepository.delete(findMember);
    }

    public Member findVerifiedMember(long memberId) {
        Optional<Member> optionalMember = memberRepository.findById(memberId);
        Member findMember =
                optionalMember.orElseThrow(() ->
                        new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));
        return findMember;
    }

    /**
     * 회원 정보 중에 name 필드를 제외한 회원 정보만 리턴한다.
     *
     * @param memberId
     * @return
     */
    public MemberExcludeName findMemberExcludeName(long memberId) {
        Optional<MemberExcludeName> optionalMember = memberRepository.findByMemberId(memberId);
        MemberExcludeName findMember =
                optionalMember.orElseThrow(() ->
                        new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));
        return findMember;
    }

    private void verifyExistsEmail(String email) {
        Optional<Member> member = memberRepository.findByEmail(email);
        if (member.isPresent())
            throw new BusinessLogicException(ExceptionCode.MEMBER_EXISTS);
    }
}
