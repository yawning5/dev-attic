package com.codestates.coffee.entity;

import com.codestates.audit.Auditable;
import com.codestates.order.entity.OrderCoffee;
import com.codestates.values.Money;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * <h3>Spring Data JPA 실습 Solution 코드 포함</h3>
 * Coffee 클래스는 Spring Data JPA 실습 과제 중 첫 번째 과제의 Solution 코드를 포함하고 있습니다.
 * <p>&nbsp;</p>
 * <h4>Coffee 클래스에 대한 추가 설명</h4>
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
public class Coffee extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long coffeeId;

    @Column(length = 100, nullable = false)
    private String korName;

    @Column(length = 100, nullable = false)
    private String engName;

    // 레거시 코드
    /*
    @Column(length = 5, nullable = false)
    private Integer price;
    */

    /**
     * 커피 가격을 Value Object인 Money 객체로 표현하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/Embedded.html" target="_blank">
     *             {@literal @}Embedded
     *         </a>
     *         <ul>
     *             <li>
     *                 <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html" target="_blank">
     *                     {@literal @}Embeddable
     *                 </a> 애너테이션이 추가된 클래스의 필드를 Coffee Entity의 필드로 포함시킵니다.
     *             </li>
     *             <li>
     *                 여기서는 {@link com.codestates.values.Money} 클래스의 value 필드를 Coffee Entity의 필드로 포함시킵니다.
     *             </li>
     *         </ul>
     *     </li>
     *     <li>
     *         {@literal @}AttributeOverride
     *         <ul>
     *             <li>
     *                 <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html" target="_blank">
     *                     {@literal @}Embeddable
     *                 </a> 애너테이션이 추가된 클래스 필드(value)가 price 필드를 대체할 수 있도록 오버라이드합니다.
     *             </li>
     *             <li>
     *                 name="value"의 "value"는 {@link com.codestates.values.Money} 클래스의 필드입니다.
     *             </li>
     *             <li>
     *                 column= {@literal @}Column(name = "price", nullable = false, length = 5)을 통해
     *                 기존의 price 필드에 대한 컬럼 매핑을 재정의합니다.
     *             </li>
     *         </ul>
     *     </li>
     * </ul>
     */
    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "price", nullable = false))
    private Money price;

    @Column(length = 3, nullable = false, unique = true)
    private String coffeeCode;

    /**
     * 커피 정보의 상태를 추가하기 위한 Solution 코드입니다.
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
    private CoffeeStatus coffeeStatus = CoffeeStatus.COFFEE_FOR_SALE;

    /**
     * Coffee와 OrderCoffee 간의 1대N 연관관계를 매핑하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * @see <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html" target="_blank">@OneToMany</a>
     */
    @OneToMany(mappedBy = "coffee")
    private List<OrderCoffee> orderCoffees = new ArrayList<>();

    /**
     * Coffee와 OrderCoffee 간에 양방향 연관 관계를 안전하게 매핑하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         클래스 레벨에
     *         <a href="https://projectlombok.org/api/lombok/Setter" target="_blank">
     *             {@literal @}Setter
     *         </a>애너테이션으로 setter를 추가했지만 양방향 연관관계를 안전하게 매핑하기 위해 orderCoffee 쪽에도 coffee를 추가합니다.
     *     </li>
     *     <li>
     *         이 처럼 양방향 관계일 경우, 한 쪽의 엔티티만 추가해주는 실수를 하더라도 다른 쪽 엔티티를 추가해 주기 때문에
     *         정상적인 연관관계 매핑을 보장해 줍니다.
     *     </li>
     * </ul>
     * @param orderCoffee   coffee와 연관관계를 맺을 대상인 orderCoffee 객체
     */
    public void setOrderCoffee(OrderCoffee orderCoffee) {
        this.orderCoffees.add(orderCoffee);
        if (orderCoffee.getCoffee() != this) {
            orderCoffee.setCoffee(this);
        }
    }

    // 커피 상태 추가
    public enum CoffeeStatus {
        COFFEE_FOR_SALE("판매중"),
        COFFEE_SOLD_OUT("판매중지");

        @Getter
        private String status;

        CoffeeStatus(String status) {
            this.status = status;
        }
    }
}
