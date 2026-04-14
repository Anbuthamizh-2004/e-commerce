import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Flame, ShoppingCart, Plus, Minus, ArrowLeft, Heart } from 'lucide-react';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(id)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/menu'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    await addItem(product.id, qty);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
      <div className="spinner" />
    </div>
  );

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="page-enter">
      <div className="container" style={{ padding: '32px 24px' }}>
        <Link to="/menu" style={styles.backLink}>
          <ArrowLeft size={18} /> Back to Menu
        </Link>

        <div style={styles.grid}>
          {/* Image */}
          <div style={styles.imageSection}>
            <div style={styles.imageWrapper}>
              <img src={product.imageUrl} alt={product.name} style={styles.image} />
              {discount > 0 && <span style={styles.discountBadge}>{discount}% OFF</span>}
            </div>
          </div>

          {/* Details */}
          <div style={styles.details}>
            <div style={styles.topRow}>
              <div style={styles.vegIndicator}>
                <span style={{ ...styles.vegDot, background: product.isVeg ? '#22C55E' : '#EF4444' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: product.isVeg ? '#16A34A' : '#DC2626' }}>
                  {product.isVeg ? 'Pure Veg' : 'Non-Veg'}
                </span>
              </div>
              {product.category && (
                <span style={styles.catBadge}>{product.category.name}</span>
              )}
            </div>

            <h1 style={styles.name}>{product.name}</h1>
            <p style={styles.description}>{product.description}</p>

            {/* Stats */}
            <div style={styles.stats}>
              {product.rating > 0 && (
                <div style={styles.statCard}>
                  <Star size={20} fill="#F4C842" color="#F4C842" />
                  <div>
                    <strong>{Number(product.rating).toFixed(1)}</strong>
                    <span>{product.reviewCount} reviews</span>
                  </div>
                </div>
              )}
              {product.prepTimeMinutes && (
                <div style={styles.statCard}>
                  <Clock size={20} color="#E8430A" />
                  <div>
                    <strong>{product.prepTimeMinutes} min</strong>
                    <span>Prep time</span>
                  </div>
                </div>
              )}
              {product.calories && (
                <div style={styles.statCard}>
                  <Flame size={20} color="#E8430A" />
                  <div>
                    <strong>{product.calories}</strong>
                    <span>Calories</span>
                  </div>
                </div>
              )}
            </div>

            {/* Price */}
            <div style={styles.priceRow}>
              <span style={styles.price}>₹{Number(product.price).toFixed(0)}</span>
              {product.originalPrice && (
                <span style={styles.originalPrice}>₹{Number(product.originalPrice).toFixed(0)}</span>
              )}
              {discount > 0 && <span style={styles.discountText}>Save {discount}%</span>}
            </div>

            {/* Qty + Add to Cart */}
            <div style={styles.addRow}>
              <div style={styles.qtyControl}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>
                  <Minus size={16} />
                </button>
                <span style={styles.qtyNum}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={styles.qtyBtn}>
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px 24px' }}>
                <ShoppingCart size={18} />
                Add to Cart — ₹{(product.price * qty).toFixed(0)}
              </button>
            </div>

            {/* Info */}
            <div style={styles.infoBox}>
              <p>🚚 Free delivery on orders above ₹299</p>
              <p>⏱️ Estimated delivery: 30–45 minutes</p>
              <p>✅ Fresh & made-to-order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backLink: { display: 'inline-flex', alignItems: 'center', gap: 8, color: '#555', fontWeight: 500, marginBottom: 24, fontSize: 15 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' },
  imageSection: {},
  imageWrapper: { position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '1/1' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  discountBadge: { position: 'absolute', top: 16, left: 16, background: '#E8430A', color: '#fff', fontSize: 13, fontWeight: 700, padding: '5px 12px', borderRadius: 50 },
  details: { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow: { display: 'flex', alignItems: 'center', gap: 12 },
  vegIndicator: { display: 'flex', alignItems: 'center', gap: 6, background: '#F5F5F0', padding: '6px 12px', borderRadius: 50 },
  vegDot: { width: 12, height: 12, borderRadius: '50%', display: 'block' },
  catBadge: { background: '#FEF2EE', color: '#E8430A', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 50 },
  name: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 800, color: '#1A1A2E', lineHeight: 1.2 },
  description: { fontSize: 16, color: '#555', lineHeight: 1.7 },
  stats: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  statCard: { display: 'flex', alignItems: 'center', gap: 10, background: '#F5F5F0', padding: '12px 16px', borderRadius: 12 },
  priceRow: { display: 'flex', alignItems: 'center', gap: 12 },
  price: { fontSize: 38, fontWeight: 800, color: '#1A1A2E' },
  originalPrice: { fontSize: 22, color: '#999', textDecoration: 'line-through' },
  discountText: { background: '#DCFCE7', color: '#16A34A', fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 50 },
  addRow: { display: 'flex', gap: 16, alignItems: 'center' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: 12, border: '2px solid #E8E8E0', borderRadius: 50, padding: '6px 12px', background: '#fff' },
  qtyBtn: { width: 32, height: 32, borderRadius: '50%', background: '#F5F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' },
  qtyNum: { fontSize: 18, fontWeight: 700, minWidth: 24, textAlign: 'center' },
  infoBox: { background: '#F5F5F0', borderRadius: 16, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#555', fontWeight: 500 },
};
