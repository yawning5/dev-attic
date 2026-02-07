package com.codestates.member.entity;

import com.codestates.audit.Auditable;
import com.codestates.order.entity.Order;
import com.codestates.stamp.Stamp;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * <h3>Spring Data JPA 실습 Solution 코드 포함</h3>
 * Member 클래스는 Spring Data JPA 실습 과제 중 첫 번째 과제의 Solution 코드를 포함하고 있습니다.
 * <p>&nbsp;</p>
 * <h4>Member 클래스에 대한 추가 설명</h4>
 * <ul>
 *     <li>
 *         <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">
 *              {@literal @}Setter
 *         </a>/
 *         <a href="https://projectlombok.org/api/lombok/Getter" target="_blank">
 *             {@literal @}Getter
 *         </a>
 *         <ul>
 *             <li>
 *                 기본적으로 클래스 레벨에 lombok의
 *                 <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">
 *                    {@literal @}Setter
 *                 </a>/
 *                 <a href="https://projectlombok.org/api/lombok/Getter" target="_blank">
 *                    {@literal @}Getter
 *                 </a>를 추가하면 클래스의 모든 필드에 setter/getter 메서드가 생깁니다.
 *             </li>
 *             <li>
 *                 만약
 *                 <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">
 *                    {@literal @}Setter
 *                 </a>가 필요하지 않은 필드의 경우,
 *                 <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">
 *                    {@literal @}Setter
 *                 </a>(
 *                 <a href="https://projectlombok.org/api/lombok/AccessLevel#NONE" target="_blank">
 *                     AccessLevel.NONE
 *                 </a>)과 같이 setter를 사용할 수 없도록 접근을 제한할 수 있습니다.
 *             </li>
 *         </ul>
 *     </li>
 *     <li>
 *         <a href="https://projectlombok.org/features/constructor" target="_blank">
 *             {@literal @}NoArgsConstructor
 *         </a>
 *         <ul>
 *             <li>
 *                 파라미터가 없는 디폴트 생성자를 추가합니다.
 *                 Spring Data JPA의 경우 Entity에 디폴트 생성자가 존재하지 않으면 데이터 조회 시, 에러가 발생합니다.
 *             </li>
 *         </ul>
 *     </li>
 *     <li>
 *         {@link com.codestates.audit.Auditable}
 *         <ul>
 *             <li>
 *                 {@link com.codestates.audit.Auditable} 클래스는 엔티티 클래스마다 공통으로 존재하는 엔티티 생성일, 수정일, 작성자 등의
 *                 필드를 공통화한 뒤, 엔티티에 대한 이벤트 발생 시 해당 필드의 값을 자동으로 채워주는 기능을 합니다.
 *             </li>
 *         </ul>
 *     </li>
 * </ul>
 * @author 황정식
 * @version 1.0.0
 * @see <a href="https://projectlombok.org/features/constructor" target="_blank">@NoArgsConstructor</a>
 * @see <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">@Setter</a>
 * @see <a href="https://projectlombok.org/api/lombok/Getter" target="_blank">@Getter</a>
 * @see com.codestates.audit.Auditable
 */
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Member extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 13, nullable = false, unique = true)
    private String phone;

    /**
     * 회원의 상태를 추가하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/Enumerated.html" target="_blank">
     *             {@literal @}Enumerated
     *         </a>
     *         <ul>
     *             <li>
     *                 <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/Enumerated.html" target="_blank">
     *                     {@literal @}Enumerated
     *                 </a>는 Java enum 타입의 필드와 매핑되며,
     *                 <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/EnumType.html#ORDINAL" target="_blank">
     *                     EnumType.STRING
     *                 </a>을 지정해서 enum 타입을 문자열로 저장할 수 있습니다.
     *             </li>
     *             <li>
     *                 <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/EnumType.html#ORDINAL" target="_blank">
     *                     EnumType.ORDINAL
     *                 </a>은 enum 타입을 숫자로 표현합니다.
     *                 <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/EnumType.html#ORDINAL" target="_blank">
     *                     EnumType.ORDINAL
     *                 </a>은 enum의 순서가 바뀔 경우, 데이터 무결성이 깨어질 수 있으므로 가급적 사용하지 않는 것이 좋습니다.
     *             </li>
     *         </ul>
     *     </li>
     * </ul>
     */
    @Enumerated(value = EnumType.STRING)
    @Column(length = 20, nullable = false)
    private MemberStatus memberStatus = MemberStatus.MEMBER_ACTIVE;

    /**
     * Member와 Order 간의 1대N 연관관계를 매핑하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * @see <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html" target="_blank">@OneToMany</a>
     */
    @OneToMany(mappedBy = "member")
    private List<Order> orders = new ArrayList<>();

    /**
     * Member와 Stamp 간의 1대1 연관관계를 매핑하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         <a href="https://www.baeldung.com/jpa-cascade-types" target="_blank">cascade</a> 애트리뷰트
     *         <ul>
     *             <li>
     *                 CascadeType.PERSIST
     *                 <ul>
     *                     <li>
     *                          member 객체만 영속성 컨텍스트에 영속화(persist)하면 member와 연관관계 매핑이 되어 있는 객체까지 영속화됩니다.
     *                     </li>
     *                     <li>
     *                         JPA에서는 persist()를 호출하면 영속화 되지만, Spring Data JPA에서는 memberRepository.save(member)를 호출하면
     *                         member 뿐만 아니라 stamp까지 영속화 되고,
     *                         내부적으로 flush()가 호출되므로 DB의 테이블(MEMBER, STAMP)에 모두 INSERT됩니다.
     *                     </li>
     *                 </ul>
     *             </li>
     *             <li>
     *                 CascadeType.REMOVE
     *                 <ul>
     *                     <li>
     *                         member 객체만 영속성 컨텍스트에서 제거(remove)하면 member와 연관관계 매핑이 되어 있는 객체까지 제거됩니다.
     *                     </li>
     *                     <li>
     *                         JPA에서는 remove()를 호출하면 영속성 컨텍스트에서 엔티티가 제거되지만
     *                         Spring Data JPA에서는 memberRepository.delete(member)를 호출하면
     *                         member뿐만 아니라 stamp까지 영속성 컨텍스트에서 제거되고, DB의 테이블(MEMBER, STAMP)에서 모두 DELETE됩니다.
     *                     </li>
     *                 </ul>
     *             </li>
     *         </ul>
     *     </li>
     * </ul>
     * @see <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html" target="_blank">@OneToMany</a>
     */
    @OneToOne(mappedBy = "member", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private Stamp stamp;

    public Member(String email) {
        this.email = email;
    }

    public Member(String email, String name, String phone) {
        this.email = email;
        this.name = name;
        this.phone = phone;
    }

    /**
     * Member와 Order 간에 양방향 연관 관계를 안전하게 매핑하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         클래스 레벨에
     *         <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">
     *             {@literal @}Setter
     *         </a>애너테이션으로 setter를 추가했지만 양방향 연관관계를 안전하게 매핑하기 위해 order쪽에도 member를 추가합니다.
     *     </li>
     *     <li>
     *         이 처럼 양방향 관계일 경우, 한 쪽의 엔티티만 추가해주는 실수를 하더라도 다른 쪽 엔티티를 추가해 주기 때문에
     *         정상적인 연관관계 매핑을 보장해 줍니다.
     *     </li>
     * </ul>
     * @param order   member와 연관관계를 맺을 대상인 order 객체
     */
    public void setOrder(Order order) {
        orders.add(order);
        if (order.getMember() != this) {
            order.setMember(this);
        }
    }

    /**
     * Member와 Stamp 간에 양방향 연관 관계를 안전하게 매핑하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         클래스 레벨에
     *         <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">
     *             {@literal @}Setter
     *         </a>애너테이션으로 setter를 추가했지만 양방향 연관관계를 안전하게 매핑하기 위해 stamp 쪽에도 member를 추가합니다.
     *     </li>
     *     <li>
     *         이 처럼 양방향 관계일 경우, 한 쪽의 엔티티만 추가해주는 실수를 하더라도 다른 쪽 엔티티를 추가해 주기 때문에
     *         정상적인 연관관계 매핑을 보장해 줍니다.
     *     </li>
     * </ul>
     * @param stamp   member와 연관관계를 맺을 대상인 stamp 객체
     */
    public void setStamp(Stamp stamp) {
        this.stamp = stamp;
        if (stamp.getMember() != this) {
            stamp.setMember(this);
        }
    }

    public enum MemberStatus {
        MEMBER_ACTIVE("활동중"),
        MEMBER_SLEEP("휴면 상태"),
        MEMBER_QUIT("탈퇴 상태");

        @Getter
        private String status;

        MemberStatus(String status) {
           this.status = status;
        }
    }
}
