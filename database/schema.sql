-- ============================================
-- FOOD ECOMMERCE - MySQL Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS food_ecommerce;
USE food_ecommerce;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products (Food items) table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category_id BIGINT,
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    is_veg BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    calories INT,
    prep_time_minutes INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Addresses table
CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    label VARCHAR(50),
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_id BIGINT,
    status ENUM('PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') DEFAULT 'PENDING',
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 40.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH_ON_DELIVERY','ONLINE') DEFAULT 'CASH_ON_DELIVERY',
    payment_status ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
    coupon_code VARCHAR(50),
    notes TEXT,
    estimated_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id)
);

-- Order Items table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(500),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart table (persistent cart)
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cart_item (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Coupons table
CREATE TABLE coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type ENUM('PERCENTAGE','FIXED') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO categories (name, description, image_url) VALUES
('Pizza', 'Freshly baked pizzas with premium toppings', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'),
('Burgers', 'Juicy burgers with artisanal buns', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
('Biryani', 'Aromatic rice dishes with rich spices', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'),
('Sushi', 'Fresh Japanese rolls and sashimi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400'),
('Desserts', 'Sweet treats and indulgent desserts', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'),
('Healthy Bowls', 'Nutritious and balanced meal bowls', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'),
('Pasta', 'Italian pasta with homemade sauces', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400'),
('Drinks', 'Fresh juices, smoothies and beverages', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400');

INSERT INTO products (name, description, price, original_price, category_id, image_url, stock_quantity, is_veg, is_featured, rating, review_count, calories, prep_time_minutes) VALUES
('Margherita Pizza', 'Classic tomato base with fresh mozzarella and basil', 299.00, 399.00, 1, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 50, TRUE, TRUE, 4.5, 234, 850, 20),
('BBQ Chicken Pizza', 'Smoky BBQ sauce, grilled chicken, red onions and cheddar', 449.00, 549.00, 1, 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', 45, FALSE, TRUE, 4.7, 312, 1100, 25),
('Veggie Supreme Pizza', 'Bell peppers, mushrooms, olives, corn and cheese', 349.00, 429.00, 1, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', 40, TRUE, FALSE, 4.3, 187, 780, 20),
('Classic Beef Burger', 'Wagyu beef patty, lettuce, tomato, pickles and special sauce', 349.00, 429.00, 2, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 60, FALSE, TRUE, 4.6, 445, 920, 15),
('Mushroom Swiss Burger', 'Portobello mushroom, swiss cheese, caramelized onions', 299.00, 369.00, 2, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', 55, TRUE, FALSE, 4.4, 201, 840, 15),
('Crispy Chicken Burger', 'Double fried chicken fillet, coleslaw and honey mustard', 329.00, 399.00, 2, 'https://images.unsplash.com/photo-1609016840856-b3d4aa4f9f66?w=400', 50, FALSE, TRUE, 4.8, 567, 980, 18),
('Chicken Biryani', 'Fragrant basmati rice with tender chicken and aromatic spices', 379.00, 449.00, 3, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 35, FALSE, TRUE, 4.9, 789, 1200, 30),
('Veg Biryani', 'Aromatic basmati with mixed vegetables and saffron', 279.00, 349.00, 3, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', 30, TRUE, FALSE, 4.4, 321, 950, 25),
('Mutton Biryani', 'Slow-cooked mutton with dum biryani style preparation', 499.00, 599.00, 3, 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400', 25, FALSE, TRUE, 4.8, 654, 1400, 45),
('Dragon Roll', 'Shrimp tempura, avocado, cucumber topped with tuna', 549.00, 649.00, 4, 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', 20, FALSE, TRUE, 4.7, 234, 650, 20),
('Vegetable Rainbow Roll', 'Colorful veggies, tofu and avocado in sushi rice', 449.00, 529.00, 4, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', 25, TRUE, FALSE, 4.3, 156, 520, 20),
('Chocolate Lava Cake', 'Warm chocolate cake with molten center, vanilla ice cream', 199.00, 249.00, 5, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', 40, TRUE, TRUE, 4.9, 892, 580, 15),
('Mango Cheesecake', 'Creamy cheesecake with fresh mango coulis', 229.00, 289.00, 5, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', 30, TRUE, TRUE, 4.7, 445, 490, 10),
('Tiramisu', 'Classic Italian dessert with espresso and mascarpone', 219.00, 269.00, 5, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', 25, TRUE, FALSE, 4.6, 312, 420, 10),
('Quinoa Buddha Bowl', 'Quinoa, roasted veggies, chickpeas, tahini dressing', 349.00, 419.00, 6, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 45, TRUE, TRUE, 4.5, 267, 620, 15),
('Grilled Chicken Bowl', 'Brown rice, grilled chicken, steamed broccoli, teriyaki', 399.00, 469.00, 6, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 40, FALSE, FALSE, 4.6, 334, 720, 20),
('Pasta Carbonara', 'Spaghetti with pancetta, egg, pecorino and black pepper', 349.00, 429.00, 7, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', 35, FALSE, FALSE, 4.5, 289, 980, 20),
('Penne Arrabbiata', 'Penne with spicy tomato sauce and fresh herbs', 279.00, 349.00, 7, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400', 40, TRUE, TRUE, 4.3, 178, 820, 18),
('Mango Lassi', 'Chilled mango yogurt smoothie with cardamom', 149.00, 199.00, 8, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400', 100, TRUE, TRUE, 4.8, 567, 280, 5),
('Fresh Lime Soda', 'Freshly squeezed lime with soda water and mint', 99.00, 129.00, 8, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', 100, TRUE, FALSE, 4.5, 234, 80, 3);

INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, active, expires_at) VALUES
('WELCOME50', 'Welcome offer - 50% off on first order', 'PERCENTAGE', 50, 200, 150, 1000, TRUE, DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('FLAT100', 'Flat ₹100 off on orders above ₹500', 'FIXED', 100, 500, 100, 5000, TRUE, DATE_ADD(NOW(), INTERVAL 6 MONTH)),
('SAVE20', '20% discount on all orders', 'PERCENTAGE', 20, 300, 200, 10000, TRUE, DATE_ADD(NOW(), INTERVAL 3 MONTH));

-- Admin user (password: admin123 - bcrypt encoded)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin User', 'admin@foodstore.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq', '9999999999', 'ADMIN');
