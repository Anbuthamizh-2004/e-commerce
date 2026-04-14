package com.foodstore.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

public class OrderDTO {

    @Data
    public static class CreateOrderRequest {
        @NotNull private Long addressId;
        @NotEmpty private List<OrderItemRequest> items;
        private String paymentMethod = "CASH_ON_DELIVERY";
        private String couponCode;
        private String notes;
    }

    @Data
    public static class OrderItemRequest {
        @NotNull private Long productId;
        @NotNull @Min(1) private Integer quantity;
    }

    @Data
    public static class UpdateStatusRequest {
        @NotBlank private String status;
    }
}
