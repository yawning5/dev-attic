package com.codestates.order.dto;

import lombok.Getter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.List;

@Getter
public class OrderPostDto {
    @Positive
    private long memberId;

    @NotNull
    @Valid
    private List<OrderCoffeeDto> orderCoffees;
}
