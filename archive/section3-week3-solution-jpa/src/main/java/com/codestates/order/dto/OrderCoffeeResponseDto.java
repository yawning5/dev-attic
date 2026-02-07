package com.codestates.order.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class OrderCoffeeResponseDto {
    private long coffeeId;
    private int quantity;
    private String korName;
    private String engName;
    private int price;
}
