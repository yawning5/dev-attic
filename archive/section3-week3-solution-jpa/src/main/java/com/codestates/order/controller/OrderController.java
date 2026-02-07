package com.codestates.order.controller;

import com.codestates.response.MultiResponseDto;
import com.codestates.response.SingleResponseDto;
import com.codestates.member.entity.Member;
import com.codestates.member.service.MemberService;
import com.codestates.order.dto.OrderPatchDto;
import com.codestates.order.dto.OrderPostDto;
import com.codestates.order.entity.Order;
import com.codestates.order.mapper.OrderMapper;
import com.codestates.order.service.OrderService;
import com.codestates.stamp.Stamp;
import com.codestates.utils.UriCreator;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.net.URI;
import java.util.List;

/**
 * <h3>Spring Data JPA 실습 Solution 코드 포함</h3>
 * OrderController 클래스는 Spring Data JPA 실습 과제 중 두 번째 과제의 Solution 코드를 포함하고 있습니다.
 * <p>&nbsp;</p>
 * <h4>OrderController 클래스에 대한 추가 설명</h4>
 * <ul>
 *     <li>
 *         {@link com.codestates.order.controller.OrderController#postOrder(OrderPostDto)}에 Solution 코드가 추가 되었습니다.
 *     </li>
 *     <li>
 *         {@link com.codestates.order.controller.OrderController#getOrder(long)}에 Solution 코드가 추가 되었습니다.
 *     </li>
 *     <li>
 *         {@link com.codestates.order.controller.OrderController#getOrders(int, int)}에 Solution 코드가 추가 되었습니다.
 *     </li>
 * </ul>
 * @author 황정식
 * @version 1.0.0
 * @see com.codestates.order.dto.OrderResponseDto
 */
@RestController
@RequestMapping("/v11/orders")
@Validated
public class OrderController {
    private final static String ORDER_DEFAULT_URL = "/v11/orders";
    private final OrderService orderService;
    private final OrderMapper mapper;
    private final MemberService memberService;

    public OrderController(OrderService orderService,
                           OrderMapper mapper, MemberService memberService) {
        this.orderService = orderService;
        this.mapper = mapper;
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity postOrder(@Valid @RequestBody OrderPostDto orderPostDto) {
        Order order = orderService.createOrder(mapper.orderPostDtoToOrder(orderPostDto));
        URI location = UriCreator.createUri(ORDER_DEFAULT_URL, order.getOrderId());

        return ResponseEntity.created(location).build();
    }

    @PatchMapping("/{order-id}")
    public ResponseEntity patchOrder(@PathVariable("order-id") @Positive long orderId,
                                     @Valid @RequestBody OrderPatchDto orderPatchDto) {
        orderPatchDto.setOrderId(orderId);
        Order order = orderService.updateOrder(mapper.orderPatchDtoToOrder(orderPatchDto));

        return new ResponseEntity<>(
                new SingleResponseDto<>(mapper.orderToOrderResponseDto(order)), HttpStatus.OK);
    }

    /**
     * 주문 조회 시, 조회한 주문 정보를 response body에 포함시키기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         OrderService 클래스를 통해 조회한 주문 정보를 리턴 받아 response body에 추가할 수 있습니다.
     *     </li>
     * </ul>
     * @param orderId 조회하고자 하는 주문의 식별자 정보
     * @return 조회한 주문 정보(
     * <a href="https://github.com/codestates-seb/be-solution-jpa/blob/7e6e098edc80f5bbfef43db2ab3edd01afa27ed8/src/main/java/com/codestates/order/dto/OrderResponseDto.java" target="_blank">
     *      OrderResponseDto
     * </a>)를 포함하는 ResponseEntity 객체
     */
    @GetMapping("/{order-id}")
    public ResponseEntity getOrder(@PathVariable("order-id") @Positive long orderId) {
        Order order = orderService.findOrder(orderId);

        return new ResponseEntity<>(
                new SingleResponseDto<>(mapper.orderToOrderResponseDto(order)), HttpStatus.OK);
    }

    /**
     * 주문 목록 조회 시, 조회한 주문 목록 정보를 response body에 포함시키기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         OrderService 클래스를 통해 조회한 주문 목록 정보를 리턴 받아 response body에 추가할 수 있습니다.
     *     </li>
     * </ul>
     * @param page 조회하고자 하는 주문 페이지
     * @param size 조회하고자 하는 주문의 개수
     * @return 조회한 주문 목록 정보(List
     * <a href="https://github.com/codestates-seb/be-solution-jpa/blob/7e6e098edc80f5bbfef43db2ab3edd01afa27ed8/src/main/java/com/codestates/order/dto/OrderResponseDto.java" target="_blank">
     * &lt;OrderResponseDto&gt;
     * </a> )를 포함하는 ResponseEntity 객체
     */
    @GetMapping
    public ResponseEntity getOrders(@Positive @RequestParam int page,
                                    @Positive @RequestParam int size) {
        Page<Order> pageOrders = orderService.findOrders(page - 1, size);
        List<Order> orders = pageOrders.getContent();

        return new ResponseEntity<>(
                new MultiResponseDto<>(mapper.ordersToOrderResponseDtos(orders), pageOrders), HttpStatus.OK);
    }

    @DeleteMapping("/{order-id}")
    public ResponseEntity cancelOrder(@PathVariable("order-id") @Positive long orderId) {
        orderService.cancelOrder(orderId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
