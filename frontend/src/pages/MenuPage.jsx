import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getProducts, getCategories, getProductsByCategory, searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [vegFilter, setVegFilter] = useState('all'); // all | veg | nonveg
  const [sortBy, setSortBy] = useState('default');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { getCategories().then(r => setCategories(r.data)); }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;
        if (searchQ) {
          data = (await searchProducts(searchQ)).data;
        } else if (activeCategory !== 'all') {
          data = (await getProductsByCategory(activeCategory)).data;
        } else {
          data = (await getProducts()).data;
        }
        setProducts(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [searchQ, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    setSearchQ(q);
    setActiveCategory('all');
    setSearchParams(q ? { search: q } : {});
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId.toString());
    setSearchQ('');
    setSearchParams(catId !== 'all' ? { category: catId } : {});
  };

  let filtered = [...products];
  if (vegFilter === 'veg') filtered = filtered.filter(p => p.isVeg);
  if (vegFilter === 'nonveg') filtered = filtered.filter(p => !p.isVeg);
  if (sortBy === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  return (
    <div className="page-enter" style={{ minHeight: '80vh' }}>
      {/* Page Header */}
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.title}>Our Menu</h1>
          <p style={styles.subtitle}>
            {searchQ ? `Results for "${searchQ}"` : 'Explore our full collection of delicious dishes'}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Search + Filters Bar */}
        <div style={styles.toolBar}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <Search size={18} color="#999" style={{ position: 'absolute', left: 14 }} />
            <input
              name="q"
              defaultValue={searchQ}
              placeholder="Search dishes..."
              style={styles.searchInput}
            />
            {searchQ && (
              <button type="button" onClick={() => { setSearchQ(''); setSearchParams({}); }} style={styles.clearBtn}>
                <X size={16} />
              </button>
            )}
          </form>

          <div style={styles.filterGroup}>
            <select value={vegFilter} onChange={e => setVegFilter(e.target.value)} style={styles.select}>
              <option value="all">🍽 All Items</option>
              <option value="veg">🟢 Veg Only</option>
              <option value="nonveg">🔴 Non-Veg</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={styles.select}>
              <option value="default">Sort By</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={styles.categoryTabs}>
          <button
            onClick={() => handleCategoryClick('all')}
            style={{ ...styles.catTab, ...(activeCategory === 'all' ? styles.catTabActive : {}) }}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => handleCategoryClick(c.id)}
              style={{ ...styles.catTab, ...(activeCategory === c.id.toString() ? styles.catTabActive : {}) }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p style={{ color: '#777', fontSize: 14, marginBottom: 24 }}>
          {loading ? 'Loading...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Products */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: 64 }}>🍽️</span>
            <h3>No dishes found</h3>
            <p>Try a different search or category</p>
            <button onClick={() => { setSearchQ(''); setActiveCategory('all'); setSearchParams({}); }} className="btn-primary">
              View All Menu
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { background: 'linear-gradient(135deg, #1A1A2E, #16213E)', padding: '48px 0 56px', marginBottom: 0 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: '#fff', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 17 },
  toolBar: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 },
  searchForm: { flex: 1, minWidth: 240, position: 'relative', display: 'flex', alignItems: 'center' },
  searchInput: { width: '100%', paddingLeft: 44, paddingRight: 40, height: 46, border: '2px solid #E8E8E0', borderRadius: 50, fontSize: 15 },
  clearBtn: { position: 'absolute', right: 14, background: 'none', display: 'flex', alignItems: 'center', color: '#999' },
  filterGroup: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  select: { height: 46, borderRadius: 50, border: '2px solid #E8E8E0', padding: '0 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minWidth: 160, width: 'auto' },
  categoryTabs: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, overflowX: 'auto', paddingBottom: 4 },
  catTab: { padding: '8px 18px', borderRadius: 50, border: '2px solid #E8E8E0', background: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .2s', color: '#555' },
  catTabActive: { background: '#E8430A', borderColor: '#E8430A', color: '#fff' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 80, textAlign: 'center' },
};
