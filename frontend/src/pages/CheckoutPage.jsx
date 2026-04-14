import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, CheckCircle, Plus } from 'lucide-react';
import { createOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import API from '../services/api';

export default function CheckoutPage() {
  const { cartItems, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [coupon, setCoupon] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', zipCode: '', country: 'India' });

  const deliveryFee = cartTotal >= 299 ? 0 : 40;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + tax;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    API.get('/addresses').then(r => {
      setAddresses(r.data);
      if (r.data.length > 0) setSelectedAddress(r.data.find(a => a.isDefault) || r.data[0]);
    }).catch(() => {});
  }, [user]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/addresses', newAddress);
      setAddresses(prev => [...prev, res.data]);
      setSelectedAddress(res.data);
      setShowAddAddress(false);
      toast.success('Address saved!');
    } catch {
      toast.error('Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    if (cartItems.length === 0) { toast.error('Cart is empty'); return; }
    setPlacing(true);
    try {
      const items = cartItems.map(i => ({ productId: i.product.id, quantity: i.quantity }));
      const res = await createOrder({ addressId: selectedAddress.id, items, paymentMethod, couponCode: coupon || null, notes });
      await fetchCart();
      navigate(`/order-success/${res.data.id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="container" style={{ padding: '32px 24px' }}>
        <h1 style={styles.title}>Checkout</h1>

        <div style={styles.grid}>
          <div style={styles.leftCol}>
            {/* Delivery Address */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}><MapPin size={20} color="#E8430A" /> Delivery Address</h3>
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  style={{ ...styles.addrCard, ...(selectedAddress?.id === addr.id ? styles.addrCardActive : {}) }}
                >
                  <div style={styles.radioOuter}>
                    {selectedAddress?.id === addr.id && <div style={styles.radioInner} />}
                  </div>
                  <div>
                    <strong>{addr.label || 'Address'}</strong>
                    <p style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
                      {addr.street}, {addr.city}, {addr.state} – {addr.zipCode}
                    </p>
                  </div>
                </div>
              ))}

              <button onClick={() => setShowAddAddress(!showAddAddress)} style={styles.addAddrBtn}>
                <Plus size={16} /> Add New Address
              </button>

              {showAddAddress && (
                <form onSubmit={handleSaveAddress} style={styles.addrForm}>
                  <div style={styles.formRow}>
                    <div>
                      <label style={styles.label}>Label</label>
                      <select value={newAddress.label} onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))} style={styles.input}>
                        <option>Home</option><option>Work</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.label}>Zip Code</label>
                      <input required value={newAddress.zipCode} onChange={e => setNewAddress(p => ({ ...p, zipCode: e.target.value }))} style={styles.input} placeholder="620001" />
                    </div>
                  </div>
                  <label style={styles.label}>Street Address</label>
                  <input required value={newAddress.street} onChange={e => setNewAddress(p => ({ ...p, street: e.target.value }))} style={styles.input} placeholder="123 MG Road, Anna Nagar" />
                  <div style={styles.formRow}>
                    <div>
                      <label style={styles.label}>City</label>
                      <input required value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} style={styles.input} placeholder="Trichy" />
                    </div>
                    <div>
                      <label style={styles.label}>State</label>
                      <input required value={newAddress.state} onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))} style={styles.input} placeholder="Tamil Nadu" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>Save Address</button>
                </form>
              )}
            </div>

            {/* Payment Method */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}><CreditCard size={20} color="#E8430A" /> Payment Method</h3>
              {[
                { value: 'CASH_ON_DELIVERY', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' },
                { value: 'ONLINE', label: '💳 Online Payment', desc: 'UPI, Cards, Net Banking' },
              ].map(pm => (
                <div key={pm.value} onClick={() => setPaymentMethod(pm.value)}
                  style={{ ...styles.addrCard, ...(paymentMethod === pm.value ? styles.addrCardActive : {}) }}>
                  <div style={styles.radioOuter}>
                    {paymentMethod === pm.value && <div style={styles.radioInner} />}
                  </div>
                  <div>
                    <strong>{pm.label}</strong>
                    <p style={{ fontSize: 13, color: '#777', marginTop: 2 }}>{pm.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📝 Special Instructions</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requests or dietary requirements?"
                style={{ ...styles.input, height: 90, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div style={styles.summaryCol}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>
              <div style={styles.itemsList}>
                {cartItems.map(item => (
                  <div key={item.id} style={styles.summaryItem}>
                    <img src={item.product.imageUrl} alt={item.product.name} style={styles.summaryItemImg} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{item.product.name}</p>
                      <p style={{ fontSize: 13, color: '#999' }}>x{item.quantity}</p>
                    </div>
                    <strong>₹{(item.product.price * item.quantity).toFixed(0)}</strong>
                  </div>
                ))}
              </div>

              <hr style={styles.divider} />

              <div style={styles.summaryRows}>
                <div style={styles.row}><span>Subtotal</span><span>₹{cartTotal.toFixed(0)}</span></div>
                <div style={styles.row}><span>Delivery</span><span style={{ color: deliveryFee === 0 ? '#22C55E' : '' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                <div style={styles.row}><span>Tax (5%)</span><span>₹{tax.toFixed(0)}</span></div>
              </div>

              <hr style={styles.divider} />
              <div style={{ ...styles.row, fontWeight: 700, fontSize: 20, color: '#1A1A2E' }}>
                <span>Total</span>
                <span style={{ color: '#E8430A' }}>₹{total.toFixed(0)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16, marginTop: 20, opacity: placing ? 0.7 : 1 }}
              >
                {placing ? 'Placing Order...' : '🛍️ Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 800, marginBottom: 32 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 24 },
  summaryCol: { position: 'sticky', top: 90 },
  section: { background: '#fff', borderRadius: 20, border: '1px solid #E8E8E0', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 },
  sectionTitle: { display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 },
  addrCard: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: '2px solid #E8E8E0', borderRadius: 14, cursor: 'pointer', transition: 'all .2s' },
  addrCardActive: { borderColor: '#E8430A', background: '#FFF8F5' },
  radioOuter: { width: 20, height: 20, borderRadius: '50%', border: '2px solid #E8E8E0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderColor: 'currentColor' },
  radioInner: { width: 10, height: 10, borderRadius: '50%', background: '#E8430A' },
  addAddrBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', color: '#E8430A', fontWeight: 600, fontSize: 14, padding: '6px 0' },
  addrForm: { display: 'flex', flexDirection: 'column', gap: 12, background: '#F5F5F0', borderRadius: 14, padding: 20 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 4 },
  input: { display: 'block', width: '100%', padding: '10px 14px', border: '2px solid #E8E8E0', borderRadius: 10, fontSize: 14 },
  summaryCard: { background: '#fff', borderRadius: 20, border: '1px solid #E8E8E0', padding: 24 },
  summaryTitle: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 20 },
  itemsList: { display: 'flex', flexDirection: 'column', gap: 12 },
  summaryItem: { display: 'flex', alignItems: 'center', gap: 12 },
  summaryItemImg: { width: 50, height: 50, borderRadius: 8, objectFit: 'cover' },
  divider: { border: 'none', borderTop: '1px solid #F0F0E8', margin: '12px 0' },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#555' },
};
