package com.codestates.order.dto;

import com.codestates.order.entity.Order;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <h3>Spring Data JPA 실습 Solution 코드와 관련있음</h3>
 *
 * OrderResponseDto 클래스의 memberId 필드는 {@link com.codestates.order.mapper.OrderMapper#orderToOrderResponseDto(Order)}에서
 * <a href="https://mapstruct.org/documentation/stable/api/org/mapstruct/Mapping.html" target="_blank">
 *      {@literal @}Mapping
 * </a> 애너테이션을 통해 매핑 되는 것으로 변경되었으므로, <code>setMember(Member member)</code>는 제거했습니다.
 */
@Getter
@Setter
public class OrderResponseDto {
    private long orderId;
    private long memberId;
    private Order.OrderStatus orderStatus;
    private List<OrderCoffeeResponseDto> orderCoffees;
    private LocalDateTime createdAt;

    /** 제거됨
        public void setMember(Member member) {
            this.memberId = member.getMemberId();
        }
    */
}
