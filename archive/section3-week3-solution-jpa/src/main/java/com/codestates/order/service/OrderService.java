package com.codestates.order.service;

import com.codestates.coffee.service.CoffeeService;
import com.codestates.exception.BusinessLogicException;
import com.codestates.exception.ExceptionCode;
import com.codestates.member.entity.Member;
import com.codestates.member.service.MemberService;
import com.codestates.order.entity.Order;
import com.codestates.order.repository.OrderRepository;
import com.codestates.stamp.Stamp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * <h3>Spring Data JPA 실습 Solution 코드 포함</h3>
 * OrderService 클래스는 Spring Data JPA 실습 과제 중 두 번째 과제의 Solution 코드를 포함하고 있습니다.
 * <p>&nbsp;</p>
 * <h4>OrderService 클래스에 대한 추가 설명</h4>
 * <ul>
 *     <li>
 *         {@link com.codestates.order.service.OrderService#createOrder(Order)}에 Solution 코드가 추가 되었습니다.
 *     </li>
 *     <li>
 *         {@link com.codestates.order.service.OrderService#updateStamp(Order)}가 Solution 코드로 추가 되었습니다.
 *     </li>
 *     <li>
 *         주문 상태를 업데이트 할 수 있도록 {@link com.codestates.order.service.OrderService#updateOrder(Order)}가 추가 되었습니다.
 *     </li>
 *     <li>
 *         주문한 커피 개 수 만큼의 스탬프 카운트를 계산하는
 *         {@link com.codestates.order.service.OrderService#calculateStampCount(Order)}가 추가 되었습니다.
 *     </li>
 * </ul>
 * @author 황정식
 * @version 1.0.0
 */
@Service
public class OrderService {
    private final MemberService memberService;
    private final OrderRepository orderRepository;
    private final CoffeeService coffeeService;
    public OrderService(MemberService memberService,
                        OrderRepository orderRepository,
                        CoffeeService coffeeService) {
        this.memberService = memberService;
        this.orderRepository = orderRepository;
        this.coffeeService = coffeeService;
    }

    /**
     * 주문 등록 시, 주문한 커피의 개 수 만큼 스탬프 카운트를 업데이트 하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         주문 등록 이 후, {@link com.codestates.order.service.OrderService#updateStamp(Order)}를 호출함으로써
     *         주문한 커피의 개 수 만큼의 스탬프 카운트를 업데이트 할 수 있습니다.
     *     </li>
     * </ul>
     * @param order 주문 등록을 위한 Order 객체
     * @return 등록된 Order 객체
     */
    public Order createOrder(Order order) {
        verifyOrder(order);
        Order savedOrder = saveOrder(order);

        updateStamp(savedOrder);

        return savedOrder;
    }

    /**
     * 주문 정보를 수정하기 위한 메서드입니다.
     * 현재는 주문 상태만 업데이트 할 수 있습니다.
     * @param order 주문 수정을 위한 Order 객체.
     * @return 수정된 Order 객체
     */
    public Order updateOrder(Order order) {
        Order findOrder = findVerifiedOrder(order.getOrderId());

        Optional.ofNullable(order.getOrderStatus())
                .ifPresent(orderStatus -> findOrder.setOrderStatus(orderStatus));
        return saveOrder(findOrder);
    }

    public Order findOrder(long orderId) {
        return findVerifiedOrder(orderId);
    }

    public Page<Order> findOrders(int page, int size) {
        return orderRepository.findAll(PageRequest.of(page, size,
                Sort.by("orderId").descending()));
    }

    public void cancelOrder(long orderId) {
        Order findOrder = findVerifiedOrder(orderId);
        int step = findOrder.getOrderStatus().getStepNumber();

        // OrderStatus의 step이 2 이상일 경우(ORDER_CONFIRM)에는 주문 취소가 되지 않도록한다.
        if (step >= 2) {
            throw new BusinessLogicException(ExceptionCode.CANNOT_CHANGE_ORDER);
        }
        findOrder.setOrderStatus(Order.OrderStatus.ORDER_CANCEL);
        orderRepository.save(findOrder);
    }

    private Order findVerifiedOrder(long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        Order findOrder =
                optionalOrder.orElseThrow(() ->
                        new BusinessLogicException(ExceptionCode.ORDER_NOT_FOUND));
        return findOrder;
    }

    private void verifyOrder(Order order) {
        // 회원이 존재하는지 확인
        memberService.findVerifiedMember(order.getMember().getMemberId());

        // 커피가 존재하는지 확인
        order.getOrderCoffees().stream()
                .forEach(orderCoffee -> coffeeService.findVerifiedCoffee(orderCoffee.getCoffee().getCoffeeId()));
    }

    /**
     * 주문한 커피의 개 수 만큼 스탬프 카운트를 업데이트 하기 위한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         Order 객체의 그래프 탐색을 통해 주문한 사용자의 memberId에 해당하는 Member 객체를 조회합니다.
     *     </li>
     *     <li>
     *         {@link com.codestates.order.service.OrderService#calculateStampCount(Order)}를 이용해
     *         주문한 커피 수 만큼의 스탬프 카운트를 계산합니다.
     *     </li>
     *     <li>
     *         Stamp 객체를 통해 현재 보유 중인 스탬프 카운트에 주문한 커피 수 만큼의 스탬프 카운트를 더해서 최종 스탬프 카운트로 업데이트 합니다.
     *     </li>
     * </ul>
     * <p>&nbsp;</p>
     * <p>
     *     <b>생각해 볼만한 내용</b>
     * </p>
     * <ul>
     *     <li>
     *          {@link com.codestates.order.service.OrderService#createOrder(Order)}에서 호출하는
     *          {@link com.codestates.order.service.OrderService#verifyOrder(Order)} 내부에서
     *          이미 Member 객체를 가져오기 때문에 메서드 호출 관점에서는
     *          memberService.findMember(order.getMember().getMemberId());코드는 중복 호출이라고 볼 수 있습니다.
     *     </li>
     *     <li>
     *         그런데 Member 객체를 최초 조회할 경우에는 테이블에서 조회하지만 두 번째로 Member 객체를 조회할 경우에는
     *         영속성 컨텍스트의 1차 캐시에서 조회하므로 중복 조회로 인한 비용은 거의 들지 않는다는 점을 기억하기 바랍니다.
     *     </li>
     * </ul>
     * @param order 주문 정보인 Order 객체
     */
    private void updateStamp(Order order) {
        Member member = memberService.findMember(order.getMember().getMemberId());
        int stampCount = calculateStampCount(order);

        Stamp stamp = member.getStamp();
        stamp.setStampCount(stamp.getStampCount() + stampCount);

        memberService.updateMember(member);
    }

    /**
     * 주문 정보인 Order 객체에서 주문한 커피 개수에 해당하는 스탬프 카운트를 계산합니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <ul>
     *     <li>
     *         Java의 Stream을 이용하면 주문한 커피 정보의 quantity를 얻은 후에 sum()을 이용해 합계를 손쉽게 계산할 수 있습니다.
     *     </li>
     * </ul>
     * @param order 주문한 주문 정보인 Order 객체
     * @return 주문한 커피 개수에 해당하는 스탬프 카운트
     */
    private int calculateStampCount(Order order) {
        return order.getOrderCoffees().stream()
                .map(orderCoffee -> orderCoffee.getQuantity())
                .mapToInt(quantity -> quantity)
                .sum();
    }

    private Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
}
