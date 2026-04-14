package com.foodstore.controller;

import com.foodstore.model.Address;
import com.foodstore.model.User;
import com.foodstore.repository.AddressRepository;
import com.foodstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }

    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(addressRepository.findByUserId(getUserId(ud)));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@AuthenticationPrincipal UserDetails ud,
                                               @RequestBody Address address) {
        User user = userRepository.findById(getUserId(ud)).orElseThrow();
        address.setUser(user);
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
