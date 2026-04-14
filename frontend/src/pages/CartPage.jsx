import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cartItems, cartTotal, updateItem, removeItem, clearAllItems, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = cartTotal >= 299 ? 0 : 40;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + tax;

  if (!user) return (
    <div style={styles.empty}>
      <ShoppingBag size={80} color="#ddd" />
      <h2>Please Login</h2>
      <p>Sign in to view your cart and place orders</p>
      <Link to="/login" className="btn-primary">Login Now</Link>
    </div>
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div className="spinner" />
    </div>
  );

  if (cartItems.length === 0) return (
    <div style={styles.empty}>
      <ShoppingBag size={80} color="#ddd" />
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32 }}>Your cart is empty</h2>
      <p style={{ color: '#777' }}>Looks like you haven't added anything yet</p>
      <Link to="/menu" className="btn-primary">Browse Menu</Link>
    </div>
  );

  return (
    <div className="page-enter">
      <div className="container" style={{ padding: '32px 24px' }}>
        <div style={styles.header}>
          <h1 style={styles.title}>Your Cart</h1>
          <span style={styles.itemCount}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
        </div>

        <div style={styles.grid}>
          {/* Cart Items */}
          <div style={styles.itemsCol}>
            <div style={styles.card}>
              {cartItems.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <div style={styles.cartItem}>
                    <img src={item.product.imageUrl} alt={item.product.name} style={styles.itemImg} />
                    <div style={styles.itemInfo}>
                      <h4 style={styles.itemName}>{item.product.name}</h4>
                      <p style={styles.itemCategory}>{item.product.category?.name}</p>
                      <span style={{ ...styles.vegDot, background: item.product.isVeg ? '#22C55E' : '#EF4444', display: 'inline-block', width: 10, height: 10, borderRadius: '50%', marginRight: 4 }} />
                      <span style={{ fontSize: 12, color: item.product.isVeg ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                        {item.product.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>
                    <div style={styles.itemRight}>
                      <div style={styles.qtyControl}>
                        <button onClick={() => updateItem(item.product.id, item.quantity - 1)} style={styles.qtyBtn}>
                          <Minus size={14} />
                        </button>
                        <span style={styles.qty}>{item.quantity}</span>
                        <button onClick={() => updateItem(item.product.id, item.quantity + 1)} style={styles.qtyBtn}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <div style={styles.itemPriceRow}>
                        <strong style={styles.itemPrice}>₹{(item.product.price * item.quantity).toFixed(0)}</strong>
                        <button onClick={() => removeItem(item.product.id)} style={styles.deleteBtn}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {idx < cartItems.length - 1 && <hr style={styles.divider} />}
                </React.Fragment>
              ))}
            </div>

            {/* Coupon */}
            <div style={styles.couponBox}>
              <Tag size={18} color="#E8430A" />
              <input placeholder="Enter coupon code (e.g. WELCOME50)" style={styles.couponInput} />
              <button className="btn-secondary" style={{ padding: '10px 20px', flexShrink: 0 }}>Apply</button>
            </div>

            <button onClick={clearAllItems} style={styles.clearBtn}>
              <Trash2 size={16} /> Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div style={styles.summaryCol}>
            <div style={styles.card}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>
              <div style={styles.summaryRows}>
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Delivery Fee</span>
                  <span style={{ color: deliveryFee === 0 ? '#22C55E' : 'inherit' }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p style={styles.freeDeliveryNote}>🎉 You unlocked free delivery!</p>
                )}
                <div style={styles.summaryRow}>
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                <hr style={styles.divider} />
                <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18 }}>
                  <span>Total</span>
                  <span style={{ color: '#E8430A' }}>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8, fontSize: 16 }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <Link to="/menu" style={styles.continueShopping}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Delivery Info */}
            <div style={styles.deliveryInfo}>
              <p>🚚 <strong>Free delivery</strong> on orders above ₹299</p>
              <p>⏱️ Estimated delivery: <strong>30–45 min</strong></p>
              <p>💳 Pay on delivery or online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '100px 24px', textAlign: 'center' },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 800 },
  itemCount: { background: '#FEF2EE', color: '#E8430A', padding: '4px 14px', borderRadius: 50, fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' },
  itemsCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  summaryCol: { display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 90 },
  card: { background: '#fff', borderRadius: 20, border: '1px solid #E8E8E0', padding: 24 },
  cartItem: { display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0' },
  itemImg: { width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0 },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontWeight: 700, fontSize: 16, marginBottom: 2 },
  itemCategory: { color: '#999', fontSize: 13 },
  itemRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 },
  qtyControl: { display: 'flex', alignItems: 'center', gap: 10, border: '2px solid #E8E8E0', borderRadius: 50, padding: '4px 8px' },
  qtyBtn: { width: 26, height: 26, borderRadius: '50%', background: '#F5F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qty: { fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: 'center' },
  itemPriceRow: { display: 'flex', alignItems: 'center', gap: 12 },
  itemPrice: { fontSize: 18, fontWeight: 700 },
  deleteBtn: { background: 'none', color: '#ccc', display: 'flex', alignItems: 'center', transition: 'color .2s', padding: 4 },
  divider: { border: 'none', borderTop: '1px solid #F0F0E8', margin: '8px 0' },
  couponBox: { display: 'flex', gap: 12, alignItems: 'center', background: '#fff', border: '2px solid #E8E8E0', borderRadius: 16, padding: '12px 16px' },
  couponInput: { flex: 1, border: 'none', fontSize: 14, background: 'transparent', outline: 'none' },
  clearBtn: { background: 'none', color: '#EF4444', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', alignSelf: 'flex-start' },
  summaryTitle: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 20 },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: 14 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#555' },
  freeDeliveryNote: { fontSize: 12, color: '#16A34A', fontWeight: 600 },
  continueShopping: { display: 'block', textAlign: 'center', marginTop: 16, color: '#777', fontSize: 14 },
  deliveryInfo: { background: '#F5F5F0', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#555' },
};
