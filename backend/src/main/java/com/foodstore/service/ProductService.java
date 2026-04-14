package com.foodstore.service;

import com.foodstore.model.Product;
import com.foodstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findByActiveTrue();
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndActiveTrue();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.searchProducts(query);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updated) {
        Product existing = getProductById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setOriginalPrice(updated.getOriginalPrice());
        existing.setCategory(updated.getCategory());
        existing.setImageUrl(updated.getImageUrl());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setIsVeg(updated.getIsVeg());
        existing.setIsFeatured(updated.getIsFeatured());
        existing.setCalories(updated.getCalories());
        existing.setPrepTimeMinutes(updated.getPrepTimeMinutes());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);
    }
}
