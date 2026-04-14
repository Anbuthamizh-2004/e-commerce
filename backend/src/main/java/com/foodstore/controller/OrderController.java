package com.foodstore.controller;

import com.foodstore.dto.OrderDTO.*;
import com.foodstore.model.Order;
import com.foodstore.repository.UserRepository;
import com.foodstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@AuthenticationPrincipal UserDetails ud,
                                              @Valid @RequestBody CreateOrderRequest req) {
        return ResponseEntity.ok(orderService.createOrder(getUserId(ud), req));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(orderService.getUserOrders(getUserId(ud)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                               @RequestBody UpdateStatusRequest req) {
        return ResponseEntity.ok(orderService.updateStatus(id, req.getStatus()));
    }
}
