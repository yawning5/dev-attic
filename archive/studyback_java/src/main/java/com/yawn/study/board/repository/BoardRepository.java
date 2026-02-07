package com.yawn.study.board.repository;

import com.yawn.study.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    /*
    FETCH JOIN 연관된 엔티티를 한 번의 쿼리로 "함께" 가져오게 해주는 JPA JOIN 방식
    board 엔티티 안의 comment 엔티티 안의 member 와 board 까지 가져온다
     -> 이러면 순환문제가 일어날거 같은데?
     fetch join 은 객체를 미리 한번에 로딩한다는 의미
     board 객체 하나 만들고 comment 들을 리스트로 넣고 각 comment 에 board 객체 '참조'도 넣고
     코드를 실행되거나 순환을 하는게 아닌 객체 구조만 세팅하는 작업 따라서 무한루프 걱정은
     dto 를 통해서 잘 끊어놨다면 걱정하지 않아도 된다
     또한 이렇게 조회해주면 N + 1 문제 발생이 되지 않는다
     */
    @Query("SELECT DISTINCT b " +
            "FROM Board b " +
            "LEFT JOIN FETCH b.comments c " +    // Board -> Comment
            "LEFT JOIN FETCH c.member " +        // Comment -> Member
            "LEFT JOIN FETCH b.member " +        // Board -> Member
            "WHERE b.id = :id")
    Optional<Board> findByIdWithAll(@Param("id") Long id);


    @Query("SELECT b " +
            "FROM Board b " +
            "JOIN FETCH b.member " +
            "WHERE b.member.id = :memberId")
    List<Board> findAllByMemberIdWithMember(@Param("memberId") Long memberId);

}
