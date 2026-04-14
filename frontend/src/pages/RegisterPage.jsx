import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data);
      toast.success(`Welcome to FoodieHub, ${res.data.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: <User size={17} color="#999" />, type: 'text', placeholder: 'John Doe' },
    { key: 'email', label: 'Email Address', icon: <Mail size={17} color="#999" />, type: 'email', placeholder: 'you@example.com' },
    { key: 'phone', label: 'Phone Number', icon: <Phone size={17} color="#999" />, type: 'tel', placeholder: '+91 98765 43210' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Link to="/" style={styles.logo}>🍽️ FoodieHub</Link>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join thousands of food lovers</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {fields.map(f => (
            <div key={f.key} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>{f.icon}</span>
                <input
                  type={f.type} required={f.key !== 'phone'}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={styles.input}
                />
              </div>
            </div>
          ))}

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}><Lock size={17} color="#999" /></span>
              <input
                type={showPw ? 'text' : 'password'} required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Min. 6 characters"
                style={styles.input}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account 🎉'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#E8430A', fontWeight: 600 }}>Sign in</Link>
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
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: '#333' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 14 },
  input: { width: '100%', paddingLeft: 42, paddingRight: 14, height: 48, border: '2px solid #E8E8E0', borderRadius: 12, fontSize: 15 },
  eyeBtn: { position: 'absolute', right: 14, background: 'none', color: '#999', display: 'flex' },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#555' },
};
