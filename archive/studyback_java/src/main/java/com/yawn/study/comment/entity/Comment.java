package com.yawn.study.comment.entity;

import com.yawn.study.board.entity.Board;
import com.yawn.study.member.entity.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "BOARD_ID")
    private Board board;

    public Comment() {}

    @Builder
    public Comment(String content,
                   Member member,
                   Board board) {
        this.content = content;
        this.member = member;
        this.board = board;
    }

    /**
     * 코멘트 객체에 작성자 객체와 댓글이 작성된 게시글 객체를 연결
     * @param board 해당 댓글이 작성된 board객체
     * @param member 해당 댓글을 작성한 member 객체
     */
    public void connectTo(Board board,
                          Member member) {
        this.board = board;
        this.member = member;
    }

    public void editComment(String content) {
        this.content = content;
    }
}
