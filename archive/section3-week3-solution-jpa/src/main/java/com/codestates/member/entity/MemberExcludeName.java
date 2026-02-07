package com.codestates.member.entity;

import com.codestates.stamp.Stamp;

/**
 * - Member 엔티티 클래스에서 name 필드를 제외한 회원 정보를 제공하기 위한 읽기 전용 엔티티의 역할을 합니다.
 * - 이렇게 하면 SQL 쿼리 문 역시 필요한 컬럼 정보만 조회를 하기 때문에 불필요한 컬럼 조회를 방지할 수 있습니다.
 * - 따라서 회원 정보 중에서 원하지 않는 정보를 제외한 후에 클라이언트 쪽에 바로 제공할 수 있습니다.
 */
public interface MemberExcludeName {
    Long getMemberId();
    String getEmail();
    String getPhone();
}
