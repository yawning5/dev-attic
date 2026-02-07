package com.yawn.study.board.controller;

import com.yawn.study.board.dto.BoardListResponseDto;
import com.yawn.study.board.dto.BoardPostDto;
import com.yawn.study.board.dto.BoardPostResponseDto;
import com.yawn.study.board.dto.BoardResponseDto;
import com.yawn.study.board.service.BoardService;
import com.yawn.study.security.dto.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @PostMapping
    public ResponseEntity<?> postBoard(@RequestBody BoardPostDto postDto,
                                       @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info("게시글 등록 요청 - 요청자 이메일: {}", userDetails.getUsername());

        BoardPostResponseDto boardPostResponseDto = boardService.boardPost(postDto, userDetails.getUsername());
        log.info("등록된 게시물의 요청자: {}", boardPostResponseDto.getEmail());

        URI location = URI.create("/board/" + boardPostResponseDto.getId());

        return ResponseEntity
                .created(location)
                .body(boardPostResponseDto);
    }

    /*
     * 여기서 조회하면 comment 의 id 와 작성자 nickname 이 출력되지 않는 문제를 발견함
     * comments 관련 매퍼문제로 확인
     */
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDto> readBoard(@PathVariable("id") long boardId) {
        log.info("게시글 열람 요청 - 열람 시도 게시글 Id: {}", boardId);

        BoardResponseDto response = boardService.boardRead(boardId);
        log.info("열람 시도된 게시글의 Id: {}", response.getId());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<BoardListResponseDto>> getAllBoards() {
        log.info("모든 게시물 열람 요청");

        List<BoardListResponseDto> boards = boardService.findAllBoards();
        log.info("조회 결과 개수: {}", boards.size());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(boards);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BoardPostResponseDto> editBoard(@PathVariable("id") long boardId,
                                                          @RequestBody BoardPostDto postDto,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info("보드에딧 컨트롤러");
        log.info("게시글 id: {}", boardId);
        BoardPostResponseDto boardPostResponseDto = boardService.boardEdit(postDto, userDetails.getUsername(), boardId);
        log.info("수정된 게시글 id: {}", boardPostResponseDto.getId());

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(boardPostResponseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable("id") long boardId,
                                         @AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info("게시글 삭제 요청 - 요청자 Id: {}, 삭제 요청 게시글 Id:{}", userDetails.getUsername(), boardId);

        boardService.boardDelete(userDetails.getUsername(), boardId);
        log.info("삭제완료");

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

}
