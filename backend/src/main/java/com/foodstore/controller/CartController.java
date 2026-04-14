package com.foodstore.controller;

import com.foodstore.model.CartItem;
import com.foodstore.repository.UserRepository;
import com.foodstore.service.CartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(cartService.getCart(getUserId(ud)));
    }

    @PostMapping
    public ResponseEntity<CartItem> addToCart(@AuthenticationPrincipal UserDetails ud,
                                               @RequestBody CartRequest req) {
        return ResponseEntity.ok(cartService.addToCart(getUserId(ud), req.getProductId(), req.getQuantity()));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<?> updateQuantity(@AuthenticationPrincipal UserDetails ud,
                                             @PathVariable Long productId,
                                             @RequestBody CartRequest req) {
        CartItem updated = cartService.updateQuantity(getUserId(ud), productId, req.getQuantity());
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeItem(@AuthenticationPrincipal UserDetails ud,
                                            @PathVariable Long productId) {
        cartService.removeFromCart(getUserId(ud), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails ud) {
        cartService.clearCart(getUserId(ud));
        return ResponseEntity.noContent().build();
    }

    @Data
    static class CartRequest {
        private Long productId;
        private int quantity = 1;
    }
}
