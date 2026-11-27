import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productsApi, categoriesApi, ordersApi, usersApi, getAuthToken } from '../services/api';

const DataContext = createContext(null);

// ── Fallback demo data (used while API loads or if no backend data) ─────
const INITIAL_SERVICES = [
  {
    id: 'SRV-201', type: 'Delivery', customerName: 'Priya S', phone: '+91 98765 43210',
    item: 'Floral Midi Dress (Lavender / M)', requestDate: '2026-11-19', status: 'Delivered',
    assignedTo: 'BlueDart Express Tracking #BD98231', notes: 'Same-day priority express requested.'
  },
  {
    id: 'SRV-202', type: 'Returns', customerName: 'Deepa K', phone: '+91 98765 43211',
    item: 'Leather Slim Belt', requestDate: '2026-11-18', status: 'In Progress',
    assignedTo: 'Courier Return Partner', notes: 'Customer requested size replacement.'
  },
  {
    id: 'SRV-203', type: 'Alterations', customerName: 'Meena R', phone: '+91 98765 43212',
    item: 'Embroidered Velvet Gown', requestDate: '2026-11-16', status: 'In Progress',
    assignedTo: 'Master Tailor Raghav', notes: 'Waist tapering and hem length adjustment by 1 inch.'
  },
  {
    id: 'SRV-204', type: 'Exchanges', customerName: 'Kavya M', phone: '+91 98765 43213',
    item: 'Puff Sleeve Top (Lilac S to M)', requestDate: '2026-11-17', status: 'Pending',
    assignedTo: 'Fulfillment Team', notes: 'Awaiting return verification.'
  }
];

const INITIAL_ENQUIRIES = [
  {
    id: 'ENQ-301', customerName: 'Ananya Gupta', email: 'ananya.g@example.com',
    phone: '+91 98765 44001', subject: 'Custom Wedding Saree Bulk Order',
    message: 'Looking to place a customized bulk order of 8 purple silk sarees for bridesmaids with customized blouses.',
    date: '2026-11-19', status: 'In Progress',
    reply: 'Bridal consultation team contacted customer via phone and sent swatch catalog.'
  },
  {
    id: 'ENQ-302', customerName: 'Rahul Sharma', email: 'rahul.s@example.com',
    phone: '+91 98765 44002', subject: 'International Shipping to Dubai',
    message: 'Do you deliver to Dubai and how long does customs take for luxury dresses?',
    date: '2026-11-18', status: 'Resolved',
    reply: 'Confirmed 4-6 business days via DHL Express with all duty prepaid options.'
  },
  {
    id: 'ENQ-303', customerName: 'Pooja Desai', email: 'pooja.d@example.com',
    phone: '+91 98765 44003', subject: 'Restock Query: Floral Midi Dress Size L',
    message: 'When will the floral midi dress in size L be back in stock? Need it for a wedding next month.',
    date: '2026-11-19', status: 'New', reply: ''
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1', title: 'New High-Value Order #ST1005',
    message: 'Ananya Patel placed an order for ₹8,999 (Cash on Delivery).',
    time: '10 mins ago', read: false, type: 'order'
  },
  {
    id: 'notif-2', title: 'Low Stock Alert',
    message: 'Straight Fit Jeans (30) is running low on stock (5 units left).',
    time: '1 hour ago', read: false, type: 'stock'
  },
  {
    id: 'notif-3', title: 'Service Request Assigned',
    message: 'Alteration request SRV-203 has been assigned to Master Tailor Raghav.',
    time: '3 hours ago', read: true, type: 'service'
  },
  {
    id: 'notif-4', title: 'New 5-Star Customer Feedback',
    message: 'Sneha R left a 5-star review: "Amazing quality and fast delivery!"',
    time: 'Yesterday', read: true, type: 'review'
  }
];

// ── Normalize backend objects → admin-frontend shape ────────────────────
function normalizeProduct(p) {
  return {
    id: p._id || p.id,
    name: p.name || '',
    category: p.categoryName || p.category || '',
    price: Number(p.price) || 0,
    discount: Number(p.discount) || 0,
    size: (Array.isArray(p.sizes) && p.sizes[0]) || p.size || 'M',
    color: p.color || '',
    stock: Number(p.stock) ?? 0,
    sold: Number(p.sold) || 0,
    rating: Number(p.rating) || 4.5,
    image: p.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    description: p.description || '',
    // Keep raw backend fields for PUT requests
    _raw: p,
  };
}

function normalizeUser(u) {
  return {
    id: u._id || u.id,
    name: (u.name || u.email || '').split(' ').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ').substring(0, 20) || 'User',
    fullName: u.name || '',
    email: u.email || '',
    phone: u.phone || '',
    address: u.address || '',
    city: u.city || '',
    ordersCount: u.ordersCount || 0,
    totalSpent: u.totalSpent || 0,
    joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
    status: 'Active',
    role: u.role || 'user',
  };
}

function normalizeOrder(o) {
  return {
    id: o._id || o.id || `#ST${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: o.user?.name || o.customerName || 'Customer',
    customerEmail: o.user?.email || o.customerEmail || '',
    customerPhone: o.user?.phone || o.customerPhone || '',
    amount: Number(o.totalAmount || o.amount || 0),
    status: o.status || 'Pending',
    date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : (o.date || ''),
    items: Array.isArray(o.items) ? o.items.map(it => ({
      name: it.product?.name || it.name || 'Fashion Ensemble',
      qty: it.quantity || it.qty || 1,
      price: Number(it.price || it.product?.price || 0),
    })) : [{ name: 'Fashion Ensemble', qty: 1, price: Number(o.totalAmount || o.amount || 0) }],
    paymentMethod: o.paymentMethod || 'UPI / Card',
    shippingAddress: (typeof o.shippingAddress === 'object')
      ? `${o.shippingAddress.street || ''}, ${o.shippingAddress.city || ''} ${o.shippingAddress.postalCode || ''}`.trim().replace(/^,\s*/, '')
      : (o.shippingAddress || ''),
  };
}

export function DataProvider({ children }) {
  /* ── State for API-backed data ───────────────────────────────────────── */
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ── Loading / error state ────────────────────────────────────────────── */
  const [loading, setLoading] = useState({ products: true, customers: true, orders: true });
  const [errors, setErrors] = useState({});

  /* ── State for local-only data (services, enquiries, etc.) ───────────── */
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch { return INITIAL_SERVICES; }
  });

  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_enquiries');
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch { return INITIAL_ENQUIRIES; }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch { return INITIAL_NOTIFICATIONS; }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_settings');
      return saved ? JSON.parse(saved) : {
        storeName: 'StyleAura Luxury Fashion',
        contactEmail: 'contact@styleaura.com',
        phone: '+91 800-STYLE-AURA',
        address: 'StyleAura Luxury Towers, Fashion Avenue, Mumbai 400001',
        currency: '₹', taxRate: 12, lowStockAlert: 10,
        emailNotifications: true, orderAlerts: true
      };
    } catch {
      return {
        storeName: 'StyleAura Luxury Fashion',
        contactEmail: 'contact@styleaura.com',
        phone: '+91 800-STYLE-AURA',
        address: 'StyleAura Luxury Towers, Fashion Avenue, Mumbai 400001',
        currency: '₹', taxRate: 12, lowStockAlert: 10,
        emailNotifications: true, orderAlerts: true
      };
    }
  });

  // Persist local-only data to localStorage
  useEffect(() => { localStorage.setItem('styleaura_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('styleaura_enquiries', JSON.stringify(enquiries)); }, [enquiries]);
  useEffect(() => { localStorage.setItem('styleaura_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('styleaura_settings', JSON.stringify(settings)); }, [settings]);

  /* ══════════════════════════════════════════════════════════════════════
     FETCH DATA FROM BACKEND
     ══════════════════════════════════════════════════════════════════════ */
  const fetchProducts = useCallback(async () => {
    setLoading(prev => ({ ...prev, products: true }));
    setErrors(prev => ({ ...prev, products: null }));
    try {
      const data = await productsApi.getAll();
      const list = Array.isArray(data) ? data : (data.products || []);
      setProducts(list.map(normalizeProduct));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setErrors(prev => ({ ...prev, products: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.getAll();
      const list = Array.isArray(data) ? data : (data.categories || []);
      setCategories(list.map(c => ({ id: c._id || c.id, name: c.name, slug: c.slug, ...c })));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    if (!getAuthToken()) return;
    setLoading(prev => ({ ...prev, customers: true }));
    setErrors(prev => ({ ...prev, customers: null }));
    try {
      const data = await usersApi.adminGetAll();
      const list = Array.isArray(data) ? data : (data.users || []);
      setCustomers(list.map(normalizeUser));
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setErrors(prev => ({ ...prev, customers: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!getAuthToken()) return;
    setLoading(prev => ({ ...prev, orders: true }));
    setErrors(prev => ({ ...prev, orders: null }));
    try {
      // Try admin endpoint first, fall back to regular orders
      let data;
      try {
        data = await ordersApi.adminGetAll();
      } catch {
        data = await ordersApi.getAll();
      }
      const list = Array.isArray(data) ? data : (data.orders || []);
      setOrders(list.map(normalizeOrder));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setErrors(prev => ({ ...prev, orders: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  }, []);

  // Fetch products and categories always (public endpoints)
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Fetch customers and orders when token is available (after login)
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchCustomers();
      fetchOrders();
    }
  }, [fetchCustomers, fetchOrders]);

  // Also listen for auth changes via storage event
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'styleaura_auth_token' && e.newValue) {
        fetchCustomers();
        fetchOrders();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [fetchCustomers, fetchOrders]);

  // Provide a manual refetch trigger for after login
  const refetchProtectedData = useCallback(() => {
    fetchCustomers();
    fetchOrders();
  }, [fetchCustomers, fetchOrders]);

  /* ══════════════════════════════════════════════════════════════════════
     PRODUCT ACTIONS (persist to backend)
     ══════════════════════════════════════════════════════════════════════ */
  const addProduct = async (productData) => {
    try {
      const payload = {
        name: productData.name,
        category: (productData.category || 'dresses').toLowerCase().replace(/\s+/g, '-'),
        categoryName: productData.category || 'Dresses',
        price: Number(productData.price),
        discount: Number(productData.discount || 0),
        description: productData.description || '',
        image: productData.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
        size: productData.size || 'M',
        sizes: [productData.size || 'M'],
        color: productData.color || 'Lavender Purple',
        stock: Number(productData.stock || 0),
        inStock: Number(productData.stock || 0) > 0,
      };
      const created = await productsApi.create(payload);
      const newProduct = normalizeProduct(created.product || created);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      console.error('Failed to add product:', err);
      // Optimistic fallback: add locally so UI stays responsive
      const fallback = {
        id: `PROD-${Date.now().toString().slice(-4)}`,
        sold: 0, rating: 5.0,
        image: productData.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
        ...productData,
        price: Number(productData.price),
        discount: Number(productData.discount || 0),
        stock: Number(productData.stock || 0),
      };
      setProducts(prev => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateProduct = async (id, updatedData) => {
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    try {
      const payload = {
        name: updatedData.name,
        price: updatedData.price !== undefined ? Number(updatedData.price) : undefined,
        discount: updatedData.discount !== undefined ? Number(updatedData.discount) : undefined,
        description: updatedData.description,
        image: updatedData.image,
        size: updatedData.size,
        color: updatedData.color,
        stock: updatedData.stock !== undefined ? Number(updatedData.stock) : undefined,
        inStock: updatedData.stock !== undefined ? Number(updatedData.stock) > 0 : undefined,
      };
      // Remove undefined keys
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
      if (updatedData.category) {
        payload.category = updatedData.category.toLowerCase().replace(/\s+/g, '-');
        payload.categoryName = updatedData.category;
      }
      await productsApi.update(id, payload);
    } catch (err) {
      console.error('Failed to update product on backend:', err);
      // Keep optimistic update – user sees instant feedback
    }
  };

  const deleteProduct = async (id) => {
    // Optimistic delete
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await productsApi.delete(id);
    } catch (err) {
      console.error('Failed to delete product from backend:', err);
      // Refetch to restore if delete failed
      fetchProducts();
    }
  };

  /* ── Customer Actions (read-only from backend, local add/edit/delete for admin CRM) ── */
  const addCustomer = (customerData) => {
    const newCustomer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      ordersCount: 0, totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active', ...customerData
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id, updatedData) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  /* ── Order Actions (backend-backed) ───────────────────────────────────── */
  const addOrder = (orderData) => {
    const newOrder = {
      id: `#ST${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: orderData.items || [{ name: 'Fashion Ensemble Item', qty: 1, price: orderData.amount }],
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);

    // Push notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `New Order ${newOrder.id}`,
        message: `${newOrder.customerName} placed an order for ₹${Number(newOrder.amount).toLocaleString('en-IN')}`,
        time: 'Just now', read: false, type: 'order'
      },
      ...prev
    ]);
    return newOrder;
  };

  const updateOrder = async (id, updatedData) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o));
    // If status changed, try to persist to backend
    if (updatedData.status) {
      try {
        await ordersApi.updateStatus(id, updatedData.status);
      } catch (err) {
        console.error('Failed to update order status on backend:', err);
      }
    }
  };

  const cancelOrder = (id) => {
    updateOrder(id, { status: 'Cancelled' });
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  /* ── Service Actions (local-only) ─────────────────────────────────────── */
  const addService = (serviceData) => {
    const newService = {
      id: `SRV-${Date.now().toString().slice(-4)}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending', ...serviceData
    };
    setServices(prev => [newService, ...prev]);
    return newService;
  };

  const updateService = (id, updatedData) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  /* ── Reviews Actions (local – no backend endpoint) ─────────────────── */
  const addReview = (reviewData) => {
    const newReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      reply: '', ...reviewData
    };
    setReviews(prev => [newReview, ...prev]);
    return newReview;
  };

  const replyReview = (id, replyText) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText } : r));
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  /* ── Enquiry Actions (local-only) ──────────────────────────────────── */
  const addEnquiry = (enquiryData) => {
    const newEnquiry = {
      id: `ENQ-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New', reply: '', ...enquiryData
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
    return newEnquiry;
  };

  const replyEnquiry = (id, replyText, newStatus = 'In Progress') => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, reply: replyText, status: newStatus } : e));
  };

  const updateEnquiryStatus = (id, status) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const deleteEnquiry = (id) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  /* ── Notification Actions (local) ──────────────────────────────────── */
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => { setNotifications([]); };

  /* ── Settings Actions (local) ──────────────────────────────────────── */
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  /* ── Reset / Refresh ───────────────────────────────────────────────── */
  const resetToDefaultData = () => {
    fetchProducts();
    fetchCategories();
    fetchCustomers();
    fetchOrders();
    setServices(INITIAL_SERVICES);
    setEnquiries(INITIAL_ENQUIRIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReviews([]);
    localStorage.removeItem('styleaura_services');
    localStorage.removeItem('styleaura_enquiries');
    localStorage.removeItem('styleaura_notifications');
  };

  /* ── Computed stats (matching original dashboard design) ───────────── */
  const baseCustomersCount = customers.length > 0 ? customers.length : 0;
  const baseOrdersCount = orders.length;
  const baseProductsCount = products.length;

  const totalRatingSum = reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
  const avgRatingCalc = reviews.length > 0
    ? (totalRatingSum / reviews.length).toFixed(1)
    : products.length > 0
      ? (products.reduce((s, p) => s + (p.rating || 4.5), 0) / products.length).toFixed(1)
      : '4.8';

  const stats = {
    totalCustomers: baseCustomersCount.toLocaleString('en-IN'),
    totalOrders: baseOrdersCount.toLocaleString('en-IN'),
    totalProducts: baseProductsCount.toLocaleString('en-IN'),
    avgRating: avgRatingCalc,
    customersGrowth: '+12%',
    ordersGrowth: '+15%',
    productsGrowth: '+8%',
    ratingGrowth: '+0.2'
  };

  return (
    <DataContext.Provider
      value={{
        products, customers, orders, reviews, services, enquiries,
        notifications, settings, stats, categories,
        loading, errors,
        // Product methods
        addProduct, updateProduct, deleteProduct,
        // Customer methods
        addCustomer, updateCustomer, deleteCustomer,
        // Order methods
        addOrder, updateOrder, cancelOrder, deleteOrder,
        // Service methods
        addService, updateService, deleteService,
        // Review methods
        addReview, replyReview, deleteReview,
        // Enquiry methods
        addEnquiry, replyEnquiry, updateEnquiryStatus, deleteEnquiry,
        // Notification methods
        markNotificationAsRead, markAllNotificationsAsRead, clearNotifications,
        // Settings & Utils
        updateSettings, resetToDefaultData,
        // Refetch helpers
        refetchProducts: fetchProducts,
        refetchOrders: fetchOrders,
        refetchCustomers: fetchCustomers,
        refetchProtectedData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
