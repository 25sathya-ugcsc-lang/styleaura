import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

// Initial realistic demo data matching reference image 1
const INITIAL_PRODUCTS = [
  {
    id: 'PROD-101',
    name: 'Floral Midi Dress',
    category: 'Dresses',
    price: 2499,
    discount: 15,
    size: 'M',
    color: 'Lavender Purple',
    stock: 45,
    sold: 1250,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    description: 'Elegant flowy midi dress with delicate lilac botanical patterns, crafted in lightweight chiffon.'
  },
  {
    id: 'PROD-102',
    name: 'Puff Sleeve Top',
    category: 'Tops',
    price: 1299,
    discount: 10,
    size: 'S',
    color: 'Soft Lilac',
    stock: 32,
    sold: 980,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=600&q=80',
    description: 'Charming gathered puff-sleeve cropped blouse with smocked back and romantic sweetheart neckline.'
  },
  {
    id: 'PROD-103',
    name: 'Straight Fit Jeans',
    category: 'Jeans',
    price: 1899,
    discount: 20,
    size: '30',
    color: 'Classic Denim',
    stock: 58,
    sold: 870,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    description: 'Vintage high-rise straight-leg jeans with comfortable stretch cotton denim and clean ankle hem.'
  },
  {
    id: 'PROD-104',
    name: 'Royal Silk Kanjeevaram Saree',
    category: 'Sarees',
    price: 8999,
    discount: 12,
    size: 'Free Size',
    color: 'Deep Plum & Gold',
    stock: 18,
    sold: 420,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Opulent pure mulberry silk saree featuring intricate real zari weave and matching blouse piece.'
  },
  {
    id: 'PROD-105',
    name: 'Embroidered Velvet Gown',
    category: 'Women Clothing',
    price: 5499,
    discount: 10,
    size: 'L',
    color: 'Royal Purple',
    stock: 14,
    sold: 310,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    description: 'Luxurious velvet evening gown with hand-stitched crystal embroidery along the neckline.'
  },
  {
    id: 'PROD-106',
    name: "Classic Men's Linen Shirt",
    category: 'Men Clothing',
    price: 2199,
    discount: 15,
    size: 'XL',
    color: 'Lavender Mist',
    stock: 40,
    sold: 520,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    description: 'Breathable 100% French linen relaxed fit shirt tailored with mother-of-pearl buttons.'
  },
  {
    id: 'PROD-107',
    name: 'Metallic Quilted Crossbody',
    category: 'Accessories',
    price: 3499,
    discount: 25,
    size: 'Standard',
    color: 'Amethyst Violet',
    stock: 22,
    sold: 640,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    description: 'Quilted genuine nappa leather crossbody bag with polished metallic violet chain strap.'
  },
  {
    id: 'PROD-108',
    name: 'Pointed Stiletto Pumps',
    category: 'Footwear',
    price: 2899,
    discount: 5,
    size: '38',
    color: 'Glossy Plum',
    stock: 25,
    sold: 390,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    description: 'Sleek 3.5-inch pointed stiletto pumps with cushioned memory foam insole for all-day glamour.'
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-1001',
    name: 'Priya S',
    fullName: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 98765 43210',
    address: '42 Rosewood Avenue, Bandra West',
    city: 'Mumbai',
    ordersCount: 6,
    totalSpent: 12450,
    joinDate: '2026-03-12',
    status: 'Active'
  },
  {
    id: 'CUST-1002',
    name: 'Deepa K',
    fullName: 'Deepa Kumar',
    email: 'deepa.k@example.com',
    phone: '+91 98765 43211',
    address: '15 Palm Grove, Indiranagar',
    city: 'Bangalore',
    ordersCount: 4,
    totalSpent: 8990,
    joinDate: '2026-05-18',
    status: 'Active'
  },
  {
    id: 'CUST-1003',
    name: 'Meena R',
    fullName: 'Meena Roy',
    email: 'meena.r@example.com',
    phone: '+91 98765 43212',
    address: '78 Park Street, Central',
    city: 'Kolkata',
    ordersCount: 9,
    totalSpent: 18200,
    joinDate: '2026-01-09',
    status: 'Active'
  },
  {
    id: 'CUST-1004',
    name: 'Kavya M',
    fullName: 'Kavya Mohan',
    email: 'kavya.m@example.com',
    phone: '+91 98765 43213',
    address: '23 Jubilee Hills, Road 36',
    city: 'Hyderabad',
    ordersCount: 7,
    totalSpent: 15600,
    joinDate: '2026-04-22',
    status: 'Active'
  },
  {
    id: 'CUST-1005',
    name: 'Sneha R',
    fullName: 'Sneha Reddy',
    email: 'sneha.r@example.com',
    phone: '+91 98765 43216',
    address: '88 Lavelle Road, Richmond',
    city: 'Bangalore',
    ordersCount: 11,
    totalSpent: 22400,
    joinDate: '2026-02-14',
    status: 'Active'
  },
  {
    id: 'CUST-1006',
    name: 'Divya M',
    fullName: 'Divya Mathur',
    email: 'divya.m@example.com',
    phone: '+91 98765 43217',
    address: '104 Defence Colony, Flyover Rd',
    city: 'New Delhi',
    ordersCount: 5,
    totalSpent: 14800,
    joinDate: '2026-06-30',
    status: 'Active'
  }
];

const INITIAL_ORDERS = [
  {
    id: '#ST1001',
    customerName: 'Priya S',
    customerEmail: 'priya.s@example.com',
    customerPhone: '+91 98765 43210',
    amount: 1799,
    status: 'Processing',
    date: '2026-11-19',
    items: [
      { name: 'Puff Sleeve Top (Lilac / S)', qty: 1, price: 1299 },
      { name: 'Silk Hair Accessory Ribbon', qty: 1, price: 500 }
    ],
    paymentMethod: 'UPI / Card',
    shippingAddress: '42 Rosewood Avenue, Bandra West, Mumbai 400050'
  },
  {
    id: '#ST1002',
    customerName: 'Deepa K',
    customerEmail: 'deepa.k@example.com',
    customerPhone: '+91 98765 43211',
    amount: 999,
    status: 'Shipped',
    date: '2026-11-18',
    items: [
      { name: 'Embossed Leather Slim Belt', qty: 1, price: 999 }
    ],
    paymentMethod: 'Net Banking',
    shippingAddress: '15 Palm Grove, Indiranagar, Bangalore 560038'
  },
  {
    id: '#ST1003',
    customerName: 'Meena R',
    customerEmail: 'meena.r@example.com',
    customerPhone: '+91 98765 43212',
    amount: 2499,
    status: 'Delivered',
    date: '2026-11-17',
    items: [
      { name: 'Floral Midi Dress (Lavender / M)', qty: 1, price: 2499 }
    ],
    paymentMethod: 'Credit Card',
    shippingAddress: '78 Park Street, Central, Kolkata 700016'
  },
  {
    id: '#ST1004',
    customerName: 'Kavya M',
    customerEmail: 'kavya.m@example.com',
    customerPhone: '+91 98765 43213',
    amount: 1299,
    status: 'Processing',
    date: '2026-11-19',
    items: [
      { name: 'Puff Sleeve Top (Lilac / M)', qty: 1, price: 1299 }
    ],
    paymentMethod: 'UPI',
    shippingAddress: '23 Jubilee Hills, Road 36, Hyderabad 500033'
  },
  {
    id: '#ST1005',
    customerName: 'Ananya Patel',
    customerEmail: 'ananya.p@example.com',
    customerPhone: '+91 98765 43214',
    amount: 8999,
    status: 'Pending',
    date: '2026-11-20',
    items: [
      { name: 'Royal Silk Kanjeevaram Saree', qty: 1, price: 8999 }
    ],
    paymentMethod: 'Cash on Delivery',
    shippingAddress: '404 Koregaon Park, Lane 7, Pune 411001'
  },
  {
    id: '#ST1006',
    customerName: 'Ritu Verma',
    customerEmail: 'ritu.v@example.com',
    customerPhone: '+91 98765 43215',
    amount: 5499,
    status: 'Delivered',
    date: '2026-11-16',
    items: [
      { name: 'Embroidered Velvet Gown', qty: 1, price: 5499 }
    ],
    paymentMethod: 'Debit Card',
    shippingAddress: '55 Civil Lines, Jaipur 302006'
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'REV-1',
    customerName: 'Sneha R',
    productName: 'Floral Midi Dress',
    rating: 5,
    comment: 'Amazing quality and fast delivery!',
    date: '2026-11-18',
    reply: 'Thank you for loving our express delivery and luxury fabric! ✨ - Team StyleAura'
  },
  {
    id: 'REV-2',
    customerName: 'Divya M',
    productName: 'Puff Sleeve Top',
    rating: 4,
    comment: 'Loved the collection!',
    date: '2026-11-17',
    reply: 'We are thrilled that you love the styling! Look out for our upcoming pastel release. 💜'
  },
  {
    id: 'REV-3',
    customerName: 'Meena R',
    productName: 'Royal Silk Kanjeevaram Saree',
    rating: 5,
    comment: 'The pure zari borders and purple silk finish are truly royal. Gorgeous packaging too!',
    date: '2026-11-15',
    reply: 'Thank you Meena! It was handcrafted by master weavers.'
  },
  {
    id: 'REV-4',
    customerName: 'Priya S',
    productName: 'Straight Fit Jeans',
    rating: 5,
    comment: 'Very comfortable denim and the lavender tint stitching detail looks stunning.',
    date: '2026-11-14',
    reply: 'Thank you Priya! Enjoy the fit!'
  }
];

const INITIAL_SERVICES = [
  {
    id: 'SRV-201',
    type: 'Delivery',
    customerName: 'Priya S',
    phone: '+91 98765 43210',
    item: 'Floral Midi Dress (Lavender / M)',
    requestDate: '2026-11-19',
    status: 'Delivered',
    assignedTo: 'BlueDart Express Tracking #BD98231',
    notes: 'Same-day priority express requested.'
  },
  {
    id: 'SRV-202',
    type: 'Returns',
    customerName: 'Deepa K',
    phone: '+91 98765 43211',
    item: 'Leather Slim Belt',
    requestDate: '2026-11-18',
    status: 'In Progress',
    assignedTo: 'Courier Return Partner',
    notes: 'Customer requested size replacement.'
  },
  {
    id: 'SRV-203',
    type: 'Alterations',
    customerName: 'Meena R',
    phone: '+91 98765 43212',
    item: 'Embroidered Velvet Gown',
    requestDate: '2026-11-16',
    status: 'In Progress',
    assignedTo: 'Master Tailor Raghav',
    notes: 'Waist tapering and hem length adjustment by 1 inch.'
  },
  {
    id: 'SRV-204',
    type: 'Exchanges',
    customerName: 'Kavya M',
    phone: '+91 98765 43213',
    item: 'Puff Sleeve Top (Lilac S to M)',
    requestDate: '2026-11-17',
    status: 'Pending',
    assignedTo: 'Fulfillment Team',
    notes: 'Awaiting return verification.'
  }
];

const INITIAL_ENQUIRIES = [
  {
    id: 'ENQ-301',
    customerName: 'Ananya Gupta',
    email: 'ananya.g@example.com',
    phone: '+91 98765 44001',
    subject: 'Custom Wedding Saree Bulk Order',
    message: 'Looking to place a customized bulk order of 8 purple silk sarees for bridesmaids with customized blouses.',
    date: '2026-11-19',
    status: 'In Progress',
    reply: 'Bridal consultation team contacted customer via phone and sent swatch catalog.'
  },
  {
    id: 'ENQ-302',
    customerName: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98765 44002',
    subject: 'International Shipping to Dubai',
    message: 'Do you deliver to Dubai and how long does customs take for luxury dresses?',
    date: '2026-11-18',
    status: 'Resolved',
    reply: 'Confirmed 4-6 business days via DHL Express with all duty prepaid options.'
  },
  {
    id: 'ENQ-303',
    customerName: 'Pooja Desai',
    email: 'pooja.d@example.com',
    phone: '+91 98765 44003',
    subject: 'Restock Query: Floral Midi Dress Size L',
    message: 'When will the floral midi dress in size L be back in stock? Need it for a wedding next month.',
    date: '2026-11-19',
    status: 'New',
    reply: ''
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New High-Value Order #ST1005',
    message: 'Ananya Patel placed an order for ₹8,999 (Cash on Delivery).',
    time: '10 mins ago',
    read: false,
    type: 'order'
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert',
    message: 'Straight Fit Jeans (30) is running low on stock (5 units left).',
    time: '1 hour ago',
    read: false,
    type: 'stock'
  },
  {
    id: 'notif-3',
    title: 'Service Request Assigned',
    message: 'Alteration request SRV-203 has been assigned to Master Tailor Raghav.',
    time: '3 hours ago',
    read: true,
    type: 'service'
  },
  {
    id: 'notif-4',
    title: 'New 5-Star Customer Feedback',
    message: 'Sneha R left a 5-star review: "Amazing quality and fast delivery!"',
    time: 'Yesterday',
    read: true,
    type: 'review'
  }
];

export function DataProvider({ children }) {
  // LocalStorage state management
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_services');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_enquiries');
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('styleaura_settings');
      return saved ? JSON.parse(saved) : {
        storeName: 'StyleAura Luxury Fashion',
        contactEmail: 'contact@styleaura.com',
        phone: '+91 800-STYLE-AURA',
        address: 'StyleAura Luxury Towers, Fashion Avenue, Mumbai 400001',
        currency: '₹',
        taxRate: 12,
        lowStockAlert: 10,
        emailNotifications: true,
        orderAlerts: true
      };
    } catch {
      return {
        storeName: 'StyleAura Luxury Fashion',
        contactEmail: 'contact@styleaura.com',
        phone: '+91 800-STYLE-AURA',
        address: 'StyleAura Luxury Towers, Fashion Avenue, Mumbai 400001',
        currency: '₹',
        taxRate: 12,
        lowStockAlert: 10,
        emailNotifications: true,
        orderAlerts: true
      };
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('styleaura_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('styleaura_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('styleaura_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('styleaura_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('styleaura_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('styleaura_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('styleaura_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('styleaura_settings', JSON.stringify(settings));
  }, [settings]);

  // Product Actions
  const addProduct = (productData) => {
    const newProduct = {
      id: `PROD-${Date.now().toString().slice(-4)}`,
      sold: 0,
      rating: 5.0,
      image: productData.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      ...productData
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Customer Actions
  const addCustomer = (customerData) => {
    const newCustomer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      ordersCount: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      ...customerData
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

  // Order Actions
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
        time: 'Just now',
        read: false,
        type: 'order'
      },
      ...prev
    ]);

    return newOrder;
  };

  const updateOrder = (id, updatedData) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o));
  };

  const cancelOrder = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Service Actions
  const addService = (serviceData) => {
    const newService = {
      id: `SRV-${Date.now().toString().slice(-4)}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...serviceData
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

  // Reviews Actions
  const addReview = (reviewData) => {
    const newReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      reply: '',
      ...reviewData
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

  // Enquiry Actions
  const addEnquiry = (enquiryData) => {
    const newEnquiry = {
      id: `ENQ-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      reply: '',
      ...enquiryData
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

  // Notification Actions
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Settings Actions
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Reset to default
  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setServices(INITIAL_SERVICES);
    setEnquiries(INITIAL_ENQUIRIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem('styleaura_products');
    localStorage.removeItem('styleaura_customers');
    localStorage.removeItem('styleaura_orders');
    localStorage.removeItem('styleaura_reviews');
    localStorage.removeItem('styleaura_services');
    localStorage.removeItem('styleaura_enquiries');
    localStorage.removeItem('styleaura_notifications');
  };

  // Computed dynamic stats for Dashboard matching reference image 1 baseline
  const baseCustomersCount = 10250 + (customers.length - INITIAL_CUSTOMERS.length);
  const baseOrdersCount = 5890 + (orders.length - INITIAL_ORDERS.length);
  const baseProductsCount = 1200 + (products.length - INITIAL_PRODUCTS.length);
  
  // Calculate average rating dynamically
  const totalRatingSum = reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
  const avgRatingCalc = reviews.length > 0 
    ? (totalRatingSum / reviews.length).toFixed(1) 
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
        products,
        customers,
        orders,
        reviews,
        services,
        enquiries,
        notifications,
        settings,
        stats,
        // Product methods
        addProduct,
        updateProduct,
        deleteProduct,
        // Customer methods
        addCustomer,
        updateCustomer,
        deleteCustomer,
        // Order methods
        addOrder,
        updateOrder,
        cancelOrder,
        deleteOrder,
        // Service methods
        addService,
        updateService,
        deleteService,
        // Review methods
        addReview,
        replyReview,
        deleteReview,
        // Enquiry methods
        addEnquiry,
        replyEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        // Notification methods
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        // Settings & Utils
        updateSettings,
        resetToDefaultData
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
