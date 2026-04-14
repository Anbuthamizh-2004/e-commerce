import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Link to="/" style={styles.logo}>🍽️ FoodieHub</Link>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account to continue</p>
        </div>

        {/* Demo Credentials */}
        <div style={styles.demoBox}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Demo Account:</p>
          <p>Email: <code>admin@foodstore.com</code></p>
          <p>Password: <code>admin123</code></p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={17} color="#999" style={styles.inputIcon} />
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={17} color="#999" style={styles.inputIcon} />
              <input
                type={showPw ? 'text' : 'password'} required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Your password"
                style={styles.input}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#E8430A', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF8F5, #FFF5F0)', padding: '40px 16px' },
  card: { background: '#fff', borderRadius: 24, padding: '40px', width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  header: { textAlign: 'center', marginBottom: 28 },
  logo: { display: 'block', fontSize: 24, fontFamily: "'Playfair Display', serif", color: '#E8430A', fontWeight: 700, marginBottom: 20 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, marginBottom: 6 },
  subtitle: { color: '#777', fontSize: 15 },
  demoBox: { background: '#F5F5F0', borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#555' },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: '#333' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 14 },
  input: { width: '100%', paddingLeft: 42, paddingRight: 40, height: 48, border: '2px solid #E8E8E0', borderRadius: 12, fontSize: 15 },
  eyeBtn: { position: 'absolute', right: 14, background: 'none', color: '#999', display: 'flex' },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#555' },
};
