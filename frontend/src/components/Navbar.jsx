import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, ChevronDown, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🍽️</span>
          <span style={styles.logoText}>FoodieHub</span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <Search size={18} color="#999" style={styles.searchIcon} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for food..."
            style={styles.searchInput}
          />
        </form>

        {/* Desktop Nav Links */}
        <div style={styles.navLinks}>
          <Link to="/menu" style={styles.navLink}>Menu</Link>
          <Link to="/menu?cat=1" style={styles.navLink}>Categories</Link>
        </div>

        {/* Right Actions */}
        <div style={styles.actions}>
          {/* Cart */}
          <Link to="/cart" style={styles.cartBtn}>
            <ShoppingCart size={22} />
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </Link>

          {/* User Menu */}
          {user ? (
            <div style={styles.userMenuWrapper} ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={styles.userBtn}>
                <div style={styles.avatar}>{user.name[0].toUpperCase()}</div>
                <ChevronDown size={16} />
              </button>
              {userMenuOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                  <Link to="/orders" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <Package size={16} /> My Orders
                  </Link>
                  <Link to="/profile" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    <User size={16} /> Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={16} /> Admin Panel
                    </Link>
                  )}
                  <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                  <button onClick={handleLogout} style={{ ...styles.dropdownItem, color: '#EF4444', width: '100%', textAlign: 'left' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn-ghost" style={{ padding: '8px 16px' }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px' }}>Sign Up</Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.hamburger}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <form onSubmit={handleSearch} style={{ ...styles.searchForm, margin: '0 0 12px' }}>
            <Search size={18} color="#999" style={styles.searchIcon} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search food..."
              style={styles.searchInput}
            />
          </form>
          <Link to="/menu" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link to="/cart" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Orders</Link>
              {isAdmin && <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={handleLogout} style={{ ...styles.mobileLink, background: 'none', color: '#EF4444', textAlign: 'left' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #E8E8E0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  inner: { display: 'flex', alignItems: 'center', gap: 16, height: 70 },
  logo: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  logoIcon: { fontSize: 28 },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#E8430A' },
  searchForm: { flex: 1, maxWidth: 420, position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 14, pointerEvents: 'none' },
  searchInput: { width: '100%', paddingLeft: 42, paddingRight: 16, height: 44, border: '2px solid #E8E8E0', borderRadius: 50, fontSize: 14, transition: 'border-color .2s' },
  navLinks: { display: 'flex', gap: 4, '@media(max-width:768px)': { display: 'none' } },
  navLink: { padding: '8px 16px', borderRadius: 50, fontWeight: 500, transition: 'background .2s', color: '#1A1A2E' },
  actions: { display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' },
  cartBtn: { position: 'relative', display: 'flex', alignItems: 'center', padding: 8, borderRadius: 50, transition: 'background .2s', color: '#1A1A2E' },
  cartBadge: { position: 'absolute', top: 0, right: 0, background: '#E8430A', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userMenuWrapper: { position: 'relative' },
  userBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', padding: '6px 12px', borderRadius: 50, border: '2px solid #E8E8E0', cursor: 'pointer' },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: '#E8430A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 },
  dropdown: { position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #E8E8E0', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.14)', minWidth: 220, padding: 8, zIndex: 999 },
  dropdownHeader: { padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2 },
  dropdownItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'background .2s', background: 'none', border: 'none', color: '#1A1A2E', width: '100%' },
  hamburger: { display: 'none', background: 'none', padding: 8, borderRadius: 8, color: '#1A1A2E', '@media(max-width:768px)': { display: 'flex' } },
  mobileMenu: { padding: '16px 24px', borderTop: '1px solid #E8E8E0', display: 'flex', flexDirection: 'column', gap: 4 },
  mobileLink: { padding: '12px 16px', borderRadius: 8, fontWeight: 500, fontSize: 16, display: 'block', color: '#1A1A2E' },
};
