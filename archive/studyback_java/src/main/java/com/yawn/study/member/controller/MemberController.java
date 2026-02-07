package com.yawn.study.member.controller;

import com.yawn.study.member.dto.MemberPostDto;
import com.yawn.study.member.dto.MemberResponseDto;
import com.yawn.study.member.dto.MyPageResponseDto;
import com.yawn.study.member.service.MemberService;
import com.yawn.study.security.dto.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URI;

@Slf4j
@Controller
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity<?> postMember(@RequestBody MemberPostDto requestBody) {
        log.info("멤버 컨트롤러 시작");
        log.info("요청자 이메일: " + requestBody.getEmail());
        MemberResponseDto memberResponseDto = memberService.createMember(requestBody);
        URI location = URI.create("/member/" + memberResponseDto.getId());
        return ResponseEntity
                .created(location)
                .body(memberResponseDto);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyPage(@AuthenticationPrincipal CustomUserDetails userDetails) {
        MyPageResponseDto responseDto = memberService.getMyPage(userDetails.getUsername());
        return ResponseEntity
                .ok(responseDto);
    }
}
