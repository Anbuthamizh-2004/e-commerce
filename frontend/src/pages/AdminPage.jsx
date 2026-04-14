import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingBag, TrendingUp, ChefHat } from 'lucide-react';
import { getAllOrders, updateOrderStatus, getProducts } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];
const STATUS_COLORS = {
  PENDING: '#F59E0B', CONFIRMED: '#3B82F6', PREPARING: '#8B5CF6',
  OUT_FOR_DELIVERY: '#06B6D4', DELIVERED: '#22C55E', CANCELLED: '#EF4444',
};

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllOrders(), getProducts()])
      .then(([o, p]) => { setOrders(o.data); setProducts(p.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success('Order status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const stats = {
    totalOrders: orders.length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    revenue: orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + Number(o.total), 0),
    pending: orders.filter(o => o.status === 'PENDING').length,
  };

  return (
    <div className="page-enter">
      <div style={styles.adminHeader}>
        <div className="container">
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)' }}>Manage your restaurant operations</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: 'dashboard', label: '📊 Dashboard' },
            { key: 'orders', label: '📦 Orders' },
            { key: 'products', label: '🍕 Products' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div className="spinner" />
          </div>
        ) : tab === 'dashboard' ? (
          <div>
            {/* Stats */}
            <div style={styles.statsGrid}>
              {[
                { icon: <ShoppingBag size={28} color="#3B82F6" />, label: 'Total Orders', value: stats.totalOrders, bg: '#DBEAFE' },
                { icon: <TrendingUp size={28} color="#22C55E" />, label: 'Revenue', value: `₹${stats.revenue.toFixed(0)}`, bg: '#DCFCE7' },
                { icon: <Package size={28} color="#8B5CF6" />, label: 'Delivered', value: stats.delivered, bg: '#EDE9FE' },
                { icon: <ChefHat size={28} color="#F59E0B" />, label: 'Pending', value: stats.pending, bg: '#FEF3C7' },
              ].map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: s.bg }}>{s.icon}</div>
                  <div>
                    <p style={styles.statLabel}>{s.label}</p>
                    <p style={styles.statValue}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <h3 style={styles.sectionTitle}>Recent Orders</h3>
            <OrdersTable orders={orders.slice(0, 10)} onStatusChange={handleStatusChange} />
          </div>
        ) : tab === 'orders' ? (
          <div>
            <h3 style={styles.sectionTitle}>All Orders ({orders.length})</h3>
            <OrdersTable orders={orders} onStatusChange={handleStatusChange} />
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={styles.sectionTitle}>Products ({products.length})</h3>
            </div>
            <div style={styles.productsGrid}>
              {products.map(p => (
                <div key={p.id} style={styles.productRow}>
                  <img src={p.imageUrl} alt={p.name} style={styles.productImg} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>{p.name}</p>
                    <p style={{ fontSize: 13, color: '#999' }}>{p.category?.name}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: '#E8430A' }}>₹{Number(p.price).toFixed(0)}</p>
                    <p style={{ fontSize: 12, color: p.active ? '#22C55E' : '#EF4444' }}>{p.active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersTable({ orders, onStatusChange }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyles.table}>
        <thead>
          <tr style={tableStyles.thead}>
            <th style={tableStyles.th}>Order ID</th>
            <th style={tableStyles.th}>Customer</th>
            <th style={tableStyles.th}>Items</th>
            <th style={tableStyles.th}>Total</th>
            <th style={tableStyles.th}>Status</th>
            <th style={tableStyles.th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} style={tableStyles.tr}>
              <td style={tableStyles.td}><strong>#{order.id}</strong></td>
              <td style={tableStyles.td}>{order.user?.name || '—'}</td>
              <td style={tableStyles.td}>{order.items?.length || 0} item(s)</td>
              <td style={tableStyles.td}><strong>₹{Number(order.total).toFixed(0)}</strong></td>
              <td style={tableStyles.td}>
                <select
                  value={order.status}
                  onChange={e => onStatusChange(order.id, e.target.value)}
                  style={{ ...tableStyles.select, color: STATUS_COLORS[order.status] || '#333', border: `2px solid ${STATUS_COLORS[order.status] || '#ddd'}` }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </td>
              <td style={tableStyles.td}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  adminHeader: { background: 'linear-gradient(135deg, #1A1A2E, #16213E)', padding: '48px 0', marginBottom: 0 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: '#fff', marginBottom: 8 },
  tabs: { display: 'flex', gap: 8, marginBottom: 32, background: '#F5F5F0', borderRadius: 14, padding: 6, width: 'fit-content' },
  tab: { padding: '10px 20px', borderRadius: 10, fontSize: 15, fontWeight: 500, background: 'none', color: '#555', transition: 'all .2s' },
  tabActive: { background: '#fff', color: '#E8430A', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 },
  statCard: { background: '#fff', borderRadius: 18, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, border: '1px solid #E8E8E0' },
  statIcon: { width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statLabel: { fontSize: 13, color: '#777', marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: 800, color: '#1A1A2E' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 20 },
  productsGrid: { display: 'flex', flexDirection: 'column', gap: 2, background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8E8E0' },
  productRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid #F5F5F0' },
  productImg: { width: 52, height: 52, borderRadius: 10, objectFit: 'cover' },
};

const tableStyles = {
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8E8E0' },
  thead: { background: '#F5F5F0' },
  th: { padding: '14px 18px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#555', borderBottom: '2px solid #E8E8E0', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #F5F5F0', transition: 'background .15s' },
  td: { padding: '14px 18px', fontSize: 14, color: '#333', verticalAlign: 'middle' },
  select: { padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', cursor: 'pointer', outline: 'none' },
};
