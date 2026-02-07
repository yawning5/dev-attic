package com.codestates.order.entity;

import com.codestates.audit.Auditable;
import com.codestates.member.entity.Member;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * <h3>Spring Data JPA 실습 Solution 코드 포함</h3>
 * Order 클래스는 Spring Data JPA 실습 과제 중 첫 번째 과제의 Solution 코드를 포함하고 있습니다.
 * <p>&nbsp;</p>
 * <h4>Order 클래스에 대한 추가 설명</h4>
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
@Entity(name = "ORDERS")
public class Order extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus = OrderStatus.ORDER_REQUEST;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    /**
     * Order와 OrderCoffee 간의 1대N 연관관계를 매핑하기 위한 Solution 코드입니다.
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
     *                         order 객체만 영속성 컨텍스트에 영속화(persist)하면 order와 연관관계 매핑이 되어 있는 객체까지 영속화됩니다.
     *                     </li>
     *                     <li>
     *                         JPA에서는 persist()를 호출하면 영속화 되지만, Spring Data JPA에서는 orderRepository.save(order)를 호출하면
     *                         order 뿐만 아니라 orderCoffee까지 영속화 되고,
     *                         내부적으로 flush()가 호출되므로 DB의 테이블(ORDER, ORDER_COFFEE)에 모두 INSERT 됩니다.
     *                     </li>
     *                 </ul>
     *             </li>
     *         </ul>
     *     </li>
     * </ul>
     * @see <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html" target="_blank">@OneToMany</a>
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.PERSIST)
    private List<OrderCoffee> orderCoffees = new ArrayList<>();


    /**
     * Order와 Member간에 양방향 연관 관계를 안전하게 매핑하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         클래스 레벨에
     *         <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">
     *             {@literal @}Setter
     *         </a>애너테이션으로 setter를 추가했지만 양방향 연관관계를 안전하게 매핑하기 위해 member 쪽에도 order를 추가합니다.
     *     </li>
     *     <li>
     *         이 처럼 양방향 관계일 경우, 한 쪽의 엔티티만 추가해주는 실수를 하더라도 다른 쪽 엔티티를 추가해 주기 때문에
     *         정상적인 연관관계 매핑을 보장해 줍니다.
     *     </li>
     * </ul>
     * @param member Order와 연관관계를 맺을 대상인 Member 객체
     */
    public void setMember(Member member) {
        this.member = member;
        if (!this.member.getOrders().contains(this)) {
            this.member.getOrders().add(this);
        }
    }

    public enum OrderStatus {
        ORDER_REQUEST(1, "주문 요청"),
        ORDER_CONFIRM(2, "주문 확정"),
        ORDER_COMPLETE(3, "주문 처리 완료"),
        ORDER_CANCEL(4, "주문 취소");

        @Getter
        private int stepNumber;

        @Getter
        private String stepDescription;

        OrderStatus(int stepNumber, String stepDescription) {
            this.stepNumber = stepNumber;
            this.stepDescription = stepDescription;
        }
    }
}