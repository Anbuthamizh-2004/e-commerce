import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Clock, Truck, Shield, ChefHat, Search } from 'lucide-react';
import { getFeaturedProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getFeaturedProducts(), getCategories()])
      .then(([fp, cats]) => { setFeatured(fp.data); setCategories(cats.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/menu?search=${encodeURIComponent(searchQ)}`);
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroInner}>
          <div style={styles.heroContent}>
            <span style={styles.heroTag}>🚀 Free delivery on orders above ₹299</span>
            <h1 style={styles.heroTitle}>
              Delicious Food,<br />
              <span style={{ color: '#E8430A' }}>Delivered Fast</span>
            </h1>
            <p style={styles.heroSub}>
              Discover a world of flavors — from crispy pizzas to fragrant biryanis, 
              all made fresh and delivered to your door in under 45 minutes.
            </p>
            <form onSubmit={handleSearch} style={styles.heroSearch}>
              <Search size={20} color="#999" style={{ flexShrink: 0 }} />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search pizza, biryani, sushi..."
                style={styles.heroSearchInput}
              />
              <button type="submit" className="btn-primary" style={{ flexShrink: 0, borderRadius: 50 }}>
                Search
              </button>
            </form>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}><strong>500+</strong><span>Menu Items</span></div>
              <div style={styles.heroDivider} />
              <div style={styles.heroStat}><strong>4.8★</strong><span>Avg Rating</span></div>
              <div style={styles.heroDivider} />
              <div style={styles.heroStat}><strong>45 min</strong><span>Delivery</span></div>
            </div>
          </div>
          <div style={styles.heroImage}>
            <div style={styles.heroImageInner}>
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" alt="Delicious Food" style={styles.heroPrimaryImg} />
              <div style={styles.heroFloat1}>🍕 Just Ordered!</div>
              <div style={styles.heroFloat2}>⭐ 4.9 Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div className="container">
          <div style={styles.featuresGrid}>
            {[
              { icon: <Truck size={28} color="#E8430A" />, title: 'Fast Delivery', desc: 'Under 45 minutes, every time' },
              { icon: <ChefHat size={28} color="#E8430A" />, title: 'Fresh & Hot', desc: 'Made-to-order by expert chefs' },
              { icon: <Shield size={28} color="#E8430A" />, title: 'Safe & Hygienic', desc: 'FSSAI certified kitchen' },
              { icon: <Star size={28} color="#E8430A" />, title: 'Top Rated', desc: '4.8+ average customer rating' },
            ].map((f, i) => (
              <div key={i} style={styles.featureCard}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <h4 style={styles.featureTitle}>{f.title}</h4>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Browse Categories</h2>
              <p style={styles.sectionSub}>Find exactly what you're craving</p>
            </div>
            <Link to="/menu" className="btn-secondary" style={{ padding: '10px 20px' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={styles.categoriesGrid}>
            {categories.map(cat => (
              <Link to={`/menu?category=${cat.id}`} key={cat.id} style={styles.categoryCard}>
                <div style={styles.categoryImgWrapper}>
                  <img src={cat.imageUrl} alt={cat.name} style={styles.categoryImg} />
                  <div style={styles.categoryOverlay} />
                </div>
                <span style={styles.categoryName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ ...styles.section, background: '#F5F5F0', padding: '60px 0' }}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Featured Dishes</h2>
              <p style={styles.sectionSub}>Hand-picked favorites loved by thousands</p>
            </div>
            <Link to="/menu" className="btn-secondary" style={{ padding: '10px 20px' }}>
              Full Menu <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div className="products-grid">
              {featured.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.cta}>
        <div className="container" style={styles.ctaInner}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: '#fff', marginBottom: 10 }}>
              First Order? Get 50% Off!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
              Use code <strong>WELCOME50</strong> at checkout. Valid on orders above ₹200.
            </p>
          </div>
          <Link to="/menu" className="btn-primary" style={{ background: '#fff', color: '#E8430A', padding: '14px 32px', fontSize: 16 }}>
            Order Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #FFF8F5 0%, #FFF5F0 50%, #FFFAF0 100%)', padding: '60px 0 80px', overflow: 'hidden' },
  heroInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' },
  heroContent: { display: 'flex', flexDirection: 'column', gap: 20 },
  heroTag: { display: 'inline-block', background: '#FEF2EE', color: '#E8430A', padding: '6px 16px', borderRadius: 50, fontSize: 13, fontWeight: 600, width: 'fit-content' },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: 56, fontWeight: 900, lineHeight: 1.1, color: '#1A1A2E' },
  heroSub: { fontSize: 17, color: '#555', lineHeight: 1.7, maxWidth: 480 },
  heroSearch: { display: 'flex', gap: 12, alignItems: 'center', background: '#fff', border: '2px solid #E8E8E0', borderRadius: 50, padding: '8px 8px 8px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: 500 },
  heroSearchInput: { flex: 1, border: 'none', fontSize: 15, outline: 'none', background: 'transparent' },
  heroStats: { display: 'flex', alignItems: 'center', gap: 24 },
  heroStat: { display: 'flex', flexDirection: 'column', gap: 2, '& strong': { fontSize: 22, fontWeight: 700 }, '& span': { fontSize: 13, color: '#777' } },
  heroDivider: { width: 1, height: 36, background: '#E0E0E0' },
  heroImage: { display: 'flex', justifyContent: 'center' },
  heroImageInner: { position: 'relative', width: 460, height: 400 },
  heroPrimaryImg: { width: 400, height: 380, borderRadius: 32, objectFit: 'cover', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  heroFloat1: { position: 'absolute', bottom: 30, left: -20, background: '#fff', padding: '10px 16px', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' },
  heroFloat2: { position: 'absolute', top: 20, right: -10, background: '#E8430A', color: '#fff', padding: '10px 16px', borderRadius: 14, boxShadow: '0 8px 24px rgba(232,67,10,0.3)', fontSize: 13, fontWeight: 600 },
  features: { padding: '40px 0', borderBottom: '1px solid #E8E8E0' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 },
  featureCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24, textAlign: 'center' },
  featureIcon: { width: 60, height: 60, borderRadius: 16, background: '#FEF2EE', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 16, fontWeight: 700, color: '#1A1A2E' },
  featureDesc: { fontSize: 14, color: '#777' },
  section: { padding: '60px 0' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 },
  sectionSub: { color: '#777', fontSize: 16 },
  categoriesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 },
  categoryCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer' },
  categoryImgWrapper: { width: '100%', paddingTop: '100%', position: 'relative', borderRadius: 20, overflow: 'hidden' },
  categoryImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' },
  categoryOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' },
  categoryName: { fontWeight: 700, fontSize: 15, color: '#1A1A2E' },
  cta: { background: 'linear-gradient(135deg, #E8430A, #C73608)', padding: '60px 0', margin: '60px 0 0' },
  ctaInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 },
};
