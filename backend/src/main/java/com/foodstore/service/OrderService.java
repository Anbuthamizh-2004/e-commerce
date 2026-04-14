package com.foodstore.service;

import com.foodstore.dto.OrderDTO.*;
import com.foodstore.model.*;
import com.foodstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final CartService cartService;

    @Transactional
    public Order createOrder(Long userId, CreateOrderRequest req) {
        User user = userRepository.findById(userId).orElseThrow();
        Address address = addressRepository.findById(req.getAddressId()).orElseThrow();

        List<OrderItem> items = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId()).orElseThrow();
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);
            items.add(OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .productImage(product.getImageUrl())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .totalPrice(itemTotal)
                    .build());
        }

        BigDecimal deliveryFee = new BigDecimal("40.00");
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05")); // 5% tax
        BigDecimal total = subtotal.add(deliveryFee).add(tax);

        Order order = Order.builder()
                .user(user)
                .address(address)
                .status(Order.OrderStatus.PENDING)
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .tax(tax)
                .total(total)
                .paymentMethod(Order.PaymentMethod.valueOf(req.getPaymentMethod()))
                .couponCode(req.getCouponCode())
                .notes(req.getNotes())
                .estimatedDelivery(LocalDateTime.now().plusMinutes(45))
                .build();

        Order saved = orderRepository.save(order);
        items.forEach(i -> i.setOrder(saved));
        saved.setItems(items);
        orderRepository.save(saved);

        cartService.clearCart(userId);
        return saved;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(Order.OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }
}
