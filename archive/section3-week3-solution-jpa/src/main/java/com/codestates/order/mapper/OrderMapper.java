package com.codestates.order.mapper;

import com.codestates.coffee.entity.Coffee;
import com.codestates.member.entity.Member;
import com.codestates.order.dto.OrderCoffeeResponseDto;
import com.codestates.order.dto.OrderPatchDto;
import com.codestates.order.dto.OrderPostDto;
import com.codestates.order.dto.OrderResponseDto;
import com.codestates.order.entity.Order;
import com.codestates.order.entity.OrderCoffee;
import com.codestates.values.Money;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <h3>Spring Data JPA 실습 Solution 코드 포함</h3>
 * OrderMapper 클래스는 Spring Data JPA 실습 과제 중 두 번째 과제의 Solution 코드를 포함하고 있습니다.
 * <p>&nbsp;</p>
 * <h4>OrderMapper에 대한 추가 설명</h4>
 * <ul>
 *     <li>
 *         {@link com.codestates.order.mapper.OrderMapper#orderToOrderResponseDto(Order)}가 Solution 코드에 맞게 수정되었습니다.
 *     </li>
 *     <li>
 *         {@link com.codestates.order.mapper.OrderMapper#orderCoffeeToOrderCoffeeResponseDto(OrderCoffee)}가
 *         Solution 코드로 추가 되었습니다.
 *     </li>
 * </ul>
 */
@Mapper(componentModel = "spring")
public interface OrderMapper {
//    Order orderPostDtoToOrder(OrderPostDto orderPostDto);
    // 자동 매핑을 할 경우, Order가 OrderCoffee와 연관 관계 매핑 할 때,
    // coffeeId를 정상적으로 채워주지 않기 때문에 매핑 방법이 오히려 더 복잡해지므로 수동 매핑을 해주는게 낫다.
    default Order orderPostDtoToOrder(OrderPostDto orderPostDto) {
        Order order = new Order();
        Member member = new Member();
        member.setMemberId(orderPostDto.getMemberId());

        List<OrderCoffee> orderCoffees = orderPostDto.getOrderCoffees().stream()
                .map(orderCoffeeDto -> {
                    OrderCoffee orderCoffee = new OrderCoffee();
                    Coffee coffee = new Coffee();
                    coffee.setCoffeeId(orderCoffeeDto.getCoffeeId());
                    orderCoffee.setOrder(order);
                    orderCoffee.setCoffee(coffee);
                    orderCoffee.setQuantity(orderCoffeeDto.getQuantity());
                    return orderCoffee;
                }).collect(Collectors.toList());
        order.setMember(member);
        order.setOrderCoffees(orderCoffees);

        return order;
    }

    Order orderPatchDtoToOrder(OrderPatchDto orderPatchDto);

    List<OrderResponseDto> ordersToOrderResponseDtos(List<Order> orders);

    /**
     * Order 엔티티 객체를 response body로 전달하기 위해 OrderResponseDto로 변환하는 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         파라미터로 전달 받은 Order 객체를 OrderResponseDto로 변환하기 위해 타입이 일치하지 않는 필드는
     *         {@literal @}Mapping 애너테이션을 이용해 필드의 타입을 맞춰 줍니다.
     *         <ul>
     *             <li>
     *                 {@literal @}Mapping 애너테이션 이용 예
     *                 <ul>
     *                     <li>
     *                         <code>{@literal @}Mapping(source="member.memberId", target="memberId")</code>
     *                     </li>
     *                 </ul>
     *             </li>
     *         </ul>
     *     </li>
     *     <li>
     *          하지만 Mapstruct 내부에서 일어나는 매핑 방식을 이해하기 어려울 경우에는
     *          양 쪽 객체의 필드 타입을 개발자가 직접 수동으로 맞춰주는 것이 오히려 더 나은 Solution일 수도 있습니다.
     *          직접 매핑의 예는 OrderMapper 제일 하단 주석 처리된 코드를 참고하세요.
     *     </li>
     *     <li>
     *         Order 객체의 orderCoffees 필드는 List&lt;OrderCoffee&gt; 타입이기 때문에 내부적으로 loop를 돌면서
     *         {@link com.codestates.order.mapper.OrderMapper#orderCoffeeToOrderCoffeeResponseDto(OrderCoffee)}를 호출해
     *         OrderCoffee와 OrderCoffeeResponseDto에 대한 추가 매핑을 진행합니다.
     *     </li>
     * </ul>
     * <p>&nbsp;</p>
     * <p>
     *     <b>생각해 볼만한 내용</b>
     * </p>
     * <ul>
     *     <li>
     *         N + 1 문제
     *         <ul>
     *             <li>
     *                 주문(Order)에 해당하는 주문한 커피 정보(OrderCoffee)는 List&lt;OrderCoffee&gt;이므로, 주문한 커피 정보의 row 만큼
     *                 추가 쿼리가 발생합니다.(N + 1 문제)
     *             </li>
     *             <li>
     *                 따라서 N + 1 문제를 해결하기 위한 별도의 Solution이 필요할 수 있습니다.
     *             </li>
     *             <li>
     *                 주문한 커피 정보를 조회하면서 발생하는 N + 1 문제 해결에 대한 예제 코드는
     *                 [<a href="https://github.com/codestates-seb/be-reference-jpa#n--1-%EB%AC%B8%EC%A0%9C%EC%97%90-%EB%8C%80%ED%95%9C-%EC%98%88%EC%A0%9C-%EC%BD%94%EB%93%9C" target="_blank">
     *                     N + 1 문제에 대한 예제 코드
     *                 </a>]를 참고하세요.
     *             </li>
     *         </ul>
     *     </li>
     * </ul>
     * @param order OrderResponseDto 객체로 변환하기 위한 Order 객체
     * @return Order 객체로부터 변환된 OrderResponseDto
     */
    @Mapping(source = "member.memberId", target = "memberId")
    OrderResponseDto orderToOrderResponseDto(Order order);

    // 주문한 커피 정보를 수동으로 직접 매핑하는 예

    /**
     default OrderResponseDto orderToOrderResponseDto(Order order){
     // 객체 그래프 탐색을 통해 주문한 커피 정보를 가져온다.
     // N + 1 문제가 발생할 수 있다.
     List<OrderCoffee> orderCoffees = order.getOrderCoffees();

     OrderResponseDto orderResponseDto = new OrderResponseDto();
     orderResponseDto.setOrderId(order.getOrderId());
     orderResponseDto.setMemberId(order.getMember().getMemberId());
     orderResponseDto.setOrderStatus(order.getOrderStatus());
     orderResponseDto.setCreatedAt(order.getCreatedAt());

     // 주문한 커피 정보를 List<OrderCoffeeResponseDto>로 변경한다.
     orderResponseDto.setOrderCoffees(orderCoffeesToOrderCoffeeResponseDtos(orderCoffees));

     return orderResponseDto;
     }
     */


    /**
     * OrderCoffee 엔티티 객체를 response body로 전달하기 위해 OrderCoffeeResponseDto로 변환하는 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         이 {@link com.codestates.order.mapper.OrderMapper#orderCoffeeToOrderCoffeeResponseDto(OrderCoffee)}는
     *         {@link com.codestates.order.mapper.OrderMapper#orderToOrderResponseDto(Order)} 내부에서
     *         주문한 커피 정보(List&lt;OrderCoffee&gt;)의 수만큼 호출됩니다.
     *     </li>
     *     <li>
     *         <a href="https://github.com/codestates-seb/be-solution-jpa/blob/7e6e098edc80f5bbfef43db2ab3edd01afa27ed8/src/main/java/com/codestates/order/entity/OrderCoffee.java" target="_blank">
     *             OrderCoffee
     *         </a>의 필드인 coffee는
     *         <a href="https://github.com/codestates-seb/be-solution-jpa/blob/7e6e098edc80f5bbfef43db2ab3edd01afa27ed8/src/main/java/com/codestates/coffee/entity/Coffee.java" target="_blank">
     *              Coffee
     *         </a> 타입이므로,
     *         <a href="https://github.com/codestates-seb/be-solution-jpa/blob/7e6e098edc80f5bbfef43db2ab3edd01afa27ed8/src/main/java/com/codestates/order/dto/OrderCoffeeResponseDto.java" target="_blank">
     *              OrderCoffeeResponseDto
     *         </a>의 Primitive 타입과 매핑 되도록
     *         <a href="https://mapstruct.org/documentation/stable/api/org/mapstruct/Mapping.html" target="_blank">
     *              {@literal @}Mapping
     *         </a> 애너테이션으로 매핑 설정을 해줍니다.
     *     </li>
     *     <li>
     *         특히
     *         <a href="https://github.com/codestates-seb/be-solution-jpa/blob/7e6e098edc80f5bbfef43db2ab3edd01afa27ed8/src/main/java/com/codestates/order/dto/OrderCoffeeResponseDto.java" target="_blank">
     *             OrderCoffeeResponseDto
     *         </a>의 필드인 price는
     *         <a href="https://github.com/codestates-seb/be-solution-jpa/blob/7e6e098edc80f5bbfef43db2ab3edd01afa27ed8/src/main/java/com/codestates/coffee/entity/Coffee.java" target="_blank">
     *              Coffee
     *         </a>의 price({@link com.codestates.values.Money} 타입)와 타입이 일치하지 않으므로,
     *         coffee.price.value와 같이 타입을 맞추어 주어야 합니다.
     *     </li>
     * </ul>
     * @param orderCoffee OrderCoffeeResponseDto 객체로 변환하기 위한 OrderCoffee 객체
     * @return OrderCoffee 객체로부터 변환된 OrderCoffeeResponseDto
     */
    @Mapping(source = "coffee.coffeeId", target = "coffeeId")
    @Mapping(source = "coffee.korName", target = "korName")
    @Mapping(source = "coffee.engName", target = "engName")
    @Mapping(source = "coffee.price.value", target = "price")
    OrderCoffeeResponseDto orderCoffeeToOrderCoffeeResponseDto(OrderCoffee orderCoffee);


    // 주문한 커피 목록 정보를 가져오기 위해 수동으로 직접 전체 매핑: 전체 수동 매핑
//    default List<OrderCoffeeResponseDto> orderCoffeesToOrderCoffeeResponseDtos(
//                                                List<OrderCoffee> orderCoffees) {
//    return orderCoffees
//            .stream()
//            .map(orderCoffee -> {
//                return OrderCoffeeResponseDto
//                        .builder()
//                        .coffeeId(orderCoffee.getCoffee().getCoffeeId())
//                        .quantity(orderCoffee.getQuantity())
//                        .price(orderCoffee.getCoffee().getPrice())
//                        .korName(orderCoffee.getCoffee().getKorName())
//                        .engName(orderCoffee.getCoffee().getEngName())
//                        .build();
//            })
//            .collect(Collectors.toList());
//    }


    // 주문한 커피 목록 정보를 가져오기 위해 수동으로 직접 부분 매핑:
    // 코드 내부에서 orderCoffeeToOrderCoffeeResponseDto(orderCoffee)를 이용하는 방법
    /**
    default List<OrderCoffeeResponseDto> orderCoffeesToOrderCoffeeResponseDtos(List<OrderCoffee> orderCoffees) {
        return orderCoffees
                .stream()
                .map(orderCoffee -> orderCoffeeToOrderCoffeeResponseDto(orderCoffee))
                .collect(Collectors.toList());
    }
    */
}
