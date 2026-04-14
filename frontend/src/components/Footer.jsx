import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          {/* Brand */}
          <div>
            <div style={styles.logo}>🍽️ <span style={styles.logoText}>FoodieHub</span></div>
            <p style={styles.tagline}>Delicious food delivered fresh to your doorstep. Quality ingredients, authentic flavors.</p>
            <div style={styles.socials}>
              <a href="#" style={styles.social}><Instagram size={18} /></a>
              <a href="#" style={styles.social}><Twitter size={18} /></a>
              <a href="#" style={styles.social}><Facebook size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <div style={styles.links}>
              <Link to="/menu" style={styles.link}>Full Menu</Link>
              <Link to="/menu?cat=1" style={styles.link}>Pizza</Link>
              <Link to="/menu?cat=2" style={styles.link}>Burgers</Link>
              <Link to="/menu?cat=3" style={styles.link}>Biryani</Link>
              <Link to="/menu?cat=5" style={styles.link}>Desserts</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 style={styles.colTitle}>Account</h4>
            <div style={styles.links}>
              <Link to="/register" style={styles.link}>Create Account</Link>
              <Link to="/login" style={styles.link}>Sign In</Link>
              <Link to="/orders" style={styles.link}>My Orders</Link>
              <Link to="/profile" style={styles.link}>Profile</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={styles.colTitle}>Contact Us</h4>
            <div style={styles.contacts}>
              <span style={styles.contact}><Phone size={15} /> +91 98765 43210</span>
              <span style={styles.contact}><Mail size={15} /> hello@foodiehub.in</span>
              <span style={styles.contact}><MapPin size={15} /> Trichy, Tamil Nadu, India</span>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <p>© {new Date().getFullYear()} FoodieHub. All rights reserved.</p>
          <p>Built with React + Spring Boot + MySQL</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#1A1A2E', color: '#ccc', marginTop: 80, paddingTop: 60 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, paddingBottom: 48 },
  logo: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, marginBottom: 14 },
  logoText: { fontFamily: "'Playfair Display', serif", color: '#E8430A', fontWeight: 700 },
  tagline: { fontSize: 14, lineHeight: 1.6, color: '#aaa', marginBottom: 20 },
  socials: { display: 'flex', gap: 10 },
  social: { width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', transition: 'all .2s' },
  colTitle: { fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 16 },
  links: { display: 'flex', flexDirection: 'column', gap: 10 },
  link: { fontSize: 14, color: '#aaa', transition: 'color .2s' },
  contacts: { display: 'flex', flexDirection: 'column', gap: 12 },
  contact: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#aaa' },
  bottom: { borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 13, color: '#666' },
};
