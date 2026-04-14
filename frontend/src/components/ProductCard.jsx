import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Flame, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    await addItem(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card" style={styles.card}>
        {/* Image */}
        <div style={styles.imageWrapper}>
          <img src={product.imageUrl} alt={product.name} style={styles.image} />
          {discount > 0 && (
            <span style={styles.discountBadge}>{discount}% OFF</span>
          )}
          {product.isFeatured && (
            <span style={styles.featuredBadge}>⭐ Featured</span>
          )}
          <div style={styles.vegBadge}>
            <span style={{ ...styles.vegDot, background: product.isVeg ? '#22C55E' : '#EF4444' }} />
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.meta}>
            {product.category && (
              <span style={styles.categoryTag}>{product.category.name}</span>
            )}
          </div>
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.description}>{product.description}</p>

          {/* Stats */}
          <div style={styles.stats}>
            {product.rating > 0 && (
              <span style={styles.stat}>
                <Star size={13} fill="#F4C842" color="#F4C842" />
                {Number(product.rating).toFixed(1)}
                <span style={{ color: '#999', fontSize: 12 }}>({product.reviewCount})</span>
              </span>
            )}
            {product.prepTimeMinutes && (
              <span style={styles.stat}>
                <Clock size={13} color="#999" />
                {product.prepTimeMinutes} min
              </span>
            )}
            {product.calories && (
              <span style={styles.stat}>
                <Flame size={13} color="#E8430A" />
                {product.calories} cal
              </span>
            )}
          </div>

          {/* Price + Add */}
          <div style={styles.footer}>
            <div style={styles.priceBlock}>
              <span style={styles.price}>₹{Number(product.price).toFixed(0)}</span>
              {product.originalPrice && (
                <span style={styles.originalPrice}>₹{Number(product.originalPrice).toFixed(0)}</span>
              )}
            </div>
            <button onClick={handleAddToCart} style={styles.addBtn} title="Add to cart">
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: { cursor: 'pointer', border: '1px solid #F0F0E8', height: '100%', display: 'flex', flexDirection: 'column' },
  imageWrapper: { position: 'relative', paddingTop: '62%', overflow: 'hidden', background: '#F5F5F0' },
  image: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' },
  discountBadge: { position: 'absolute', top: 10, left: 10, background: '#E8430A', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 50 },
  featuredBadge: { position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 50 },
  vegBadge: { position: 'absolute', top: 10, right: 10, background: '#fff', width: 22, height: 22, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ddd' },
  vegDot: { width: 10, height: 10, borderRadius: '50%', display: 'block' },
  content: { padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
  meta: { display: 'flex', gap: 6 },
  categoryTag: { fontSize: 11, fontWeight: 600, color: '#E8430A', background: '#FEF2EE', padding: '2px 8px', borderRadius: 50, textTransform: 'uppercase', letterSpacing: '0.5px' },
  name: { fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: '#1A1A2E', lineHeight: 1.3 },
  description: { fontSize: 13, color: '#6B6B80', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  stats: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 2 },
  stat: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#555', fontWeight: 500 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 },
  priceBlock: { display: 'flex', alignItems: 'baseline', gap: 6 },
  price: { fontSize: 20, fontWeight: 700, color: '#1A1A2E' },
  originalPrice: { fontSize: 14, color: '#999', textDecoration: 'line-through' },
  addBtn: { width: 38, height: 38, borderRadius: '50%', background: '#E8430A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 },
};
