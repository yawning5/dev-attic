package com.yawn.study.member.repository;

import com.yawn.study.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    /*
    member 연관관계가 board 와 comment 가 1:N 이기때문에
    SELECT member 를 하면 JPA 는 JOIN 할때 조합 가능한 모든 경우를 row 로 반환
    게시글 3개 있고 댓글 2개 있으면 6개 의 row 발생
    이런 경우 DISTINCT 를 사용하면 row 수는 동일하지만
    Member 인스턴스 수는 1개로 병합되고 컬렉션 중복 제거가 된다
     */
    /*
    보드와 댓글 둘다 List 타입이기 때문에 오류발생
    Hibernate 는 내부적으로 List 를 bag(순서 있는 비중복 컬렉션) 으로 처리함
    그런데 두 개 이상의 bag 컬렉션을 fetch join 하면 중복조합을 구분할 수 없기 때문에
    쿼리결과를 매핑할수 없게 된다 따라서 쿼리를 2개 나눠서 보내기로 했다
     */
//    @Query("SELECT DISTINCT m " +
//            "FROM Member m " +
//            "LEFT JOIN FETCH m.boards " +
//            "LEFT JOIN FETCH m.comments " +
//            "WHERE m.id = :id")
//    Optional<Member> findByIdWithBoardAndComments(@Param("id") Long id);
    /*
    아래의 코드는 보드를 가져오면 보드에 딸린 댓글까지 조회해서 가져옴
    원하는건 보드 목록만 임 boardrepo 에 따로 작성
     */
//    @Query("SELECT m " +
//            "FROM Member m " +
//            "LEFT JOIN FETCH m.boards " +
//            "WHERE m.id = :id")
//    Optional<Member> findByIdWithBoards(@Param("id") Long id);
}
