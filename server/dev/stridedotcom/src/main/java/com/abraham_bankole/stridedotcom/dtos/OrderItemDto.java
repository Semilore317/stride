package com.abraham_bankole.stridedotcom.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private Long productId;
    private int quantity;
    private BigDecimal price;
}
