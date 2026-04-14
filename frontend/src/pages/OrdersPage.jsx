import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, ChefHat } from 'lucide-react';
import { getMyOrders } from '../services/api';

const STATUS_CONFIG = {
  PENDING:           { label: 'Pending',           icon: <Clock size={16} />,        color: '#F59E0B', bg: '#FEF3C7' },
  CONFIRMED:         { label: 'Confirmed',          icon: <CheckCircle size={16} />,  color: '#3B82F6', bg: '#DBEAFE' },
  PREPARING:         { label: 'Preparing',          icon: <ChefHat size={16} />,      color: '#8B5CF6', bg: '#EDE9FE' },
  OUT_FOR_DELIVERY:  { label: 'Out for Delivery',   icon: <Truck size={16} />,        color: '#06B6D4', bg: '#CFFAFE' },
  DELIVERED:         { label: 'Delivered',          icon: <CheckCircle size={16} />,  color: '#22C55E', bg: '#DCFCE7' },
  CANCELLED:         { label: 'Cancelled',          icon: <XCircle size={16} />,      color: '#EF4444', bg: '#FEE2E2' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="page-enter">
      <div style={styles.pageHeader}>
        <div className="container">
          <h1 style={styles.title}>My Orders</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)' }}>Track and manage your orders</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {orders.length === 0 ? (
          <div style={styles.empty}>
            <Package size={80} color="#ddd" />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>No orders yet</h3>
            <p style={{ color: '#777' }}>Your order history will appear here</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {orders.map(order => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <span style={styles.orderId}>Order #{order.id}</span>
                      <span style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                      {sc.icon} {sc.label}
                    </span>
                  </div>

                  <div style={styles.orderItems}>
                    {order.items.map(item => (
                      <div key={item.id} style={styles.orderItem}>
                        {item.productImage && (
                          <img src={item.productImage} alt={item.productName} style={styles.itemImg} />
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={styles.itemName}>{item.productName}</p>
                          <p style={styles.itemQty}>Qty: {item.quantity}</p>
                        </div>
                        <strong>₹{Number(item.totalPrice).toFixed(0)}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={styles.orderFooter}>
                    <div style={styles.orderMeta}>
                      <span>💳 {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Online'}</span>
                      <span>📍 {order.address?.city}</span>
                    </div>
                    <div style={styles.orderTotal}>
                      Total: <strong style={{ color: '#E8430A', fontSize: 18 }}>₹{Number(order.total).toFixed(0)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageHeader: { background: 'linear-gradient(135deg, #1A1A2E, #16213E)', padding: '48px 0', marginBottom: 0 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: '#fff', marginBottom: 8 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '80px 24px', textAlign: 'center' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: 20 },
  orderCard: { background: '#fff', borderRadius: 20, border: '1px solid #E8E8E0', overflow: 'hidden' },
  orderHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #F0F0E8', flexWrap: 'wrap', gap: 12 },
  orderId: { display: 'block', fontWeight: 700, fontSize: 16 },
  orderDate: { display: 'block', fontSize: 13, color: '#999', marginTop: 2 },
  statusBadge: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 50, fontSize: 13, fontWeight: 600 },
  orderItems: { padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 },
  orderItem: { display: 'flex', alignItems: 'center', gap: 14 },
  itemImg: { width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 },
  itemName: { fontWeight: 600, fontSize: 15 },
  itemQty: { fontSize: 13, color: '#999', marginTop: 2 },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', background: '#FAFAF8', borderTop: '1px solid #F0F0E8', flexWrap: 'wrap', gap: 12 },
  orderMeta: { display: 'flex', gap: 20, fontSize: 13, color: '#777' },
  orderTotal: { fontSize: 15, color: '#555', display: 'flex', alignItems: 'center', gap: 8 },
};
