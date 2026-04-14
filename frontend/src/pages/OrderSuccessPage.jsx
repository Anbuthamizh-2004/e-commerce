import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Clock } from 'lucide-react';
import { getOrder } from '../services/api';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) getOrder(id).then(r => setOrder(r.data));
  }, [id]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <CheckCircle size={64} color="#22C55E" strokeWidth={1.5} />
        </div>
        <h1 style={styles.title}>Order Placed! 🎉</h1>
        <p style={styles.sub}>Your delicious food is being prepared.</p>

        {order && (
          <div style={styles.orderInfo}>
            <div style={styles.infoRow}><Package size={16} /><span>Order #{order.id}</span></div>
            <div style={styles.infoRow}><Clock size={16} /><span>Estimated delivery: 30–45 minutes</span></div>
            <div style={styles.infoRow}>
              <span>💰</span>
              <span>Total: <strong style={{ color: '#E8430A' }}>₹{Number(order.total).toFixed(0)}</strong></span>
            </div>
          </div>
        )}

        <div style={styles.actions}>
          <Link to="/orders" className="btn-primary" style={{ justifyContent: 'center' }}>Track Order</Link>
          <Link to="/menu" className="btn-secondary" style={{ justifyContent: 'center' }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '40px 16px', background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' },
  card: { background: '#fff', borderRadius: 28, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 12px 50px rgba(0,0,0,0.1)' },
  iconWrapper: { width: 100, height: 100, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, marginBottom: 10 },
  sub: { color: '#555', fontSize: 17, marginBottom: 28 },
  orderInfo: { background: '#F5F5F0', borderRadius: 16, padding: '20px', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' },
  infoRow: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#444', fontWeight: 500 },
  actions: { display: 'flex', flexDirection: 'column', gap: 12 },
};
