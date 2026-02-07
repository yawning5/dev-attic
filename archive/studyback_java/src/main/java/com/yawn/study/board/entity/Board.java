package com.yawn.study.board.entity;

import com.yawn.study.comment.entity.Comment;
import com.yawn.study.member.entity.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class)
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String content;
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    protected Board() {}

    @Builder
    public Board(String title,
                 String content,
                 Member member) {
        this.title = title;
        this.content = content;
        this.member = member;
    }

    public void edit(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void setBoardCreator(Member member) {
        this.member = member;
    }
}
