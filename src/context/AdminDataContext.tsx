import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Order,
  Customer,
  ReturnTicket,
  Category,
  Coupon,
  CMSBanner,
  CMSAnnouncement,
  FAQItem,
  ProductReview,
  StoreSettings,
  InventoryLog,
  OrderStatus,
  PaymentStatus,
  ReturnStatus,
  ProductVariant
} from '../types/admin';
import {
  initialProducts,
  initialOrders,
  initialCustomers,
  initialReturns,
  initialCategories,
  initialCoupons,
  initialCMSBanners,
  initialAnnouncement,
  initialFAQs,
  initialReviews,
  initialInventoryLogs,
  initialSettings
} from '../data/initialData';
import {
  sampleProducts,
  sampleOrders,
  sampleCustomers,
  sampleCategories,
  sampleCoupons,
  sampleBanners
} from '../data/sampleData';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AdminContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Inventory
  adjustStock: (
    productId: string,
    variantSku: string,
    change: number,
    reason: InventoryLog['reason'],
    notes?: string
  ) => void;
  inventoryLogs: InventoryLog[];

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  updateOrderShipping: (orderId: string, carrier: string, trackingNumber: string, trackingUrl?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Returns & Exchanges
  returns: ReturnTicket[];
  updateReturnStatus: (returnId: string, status: ReturnStatus, refundDetails?: { amount: number; txId?: string }) => void;
  processExchangeOrder: (returnId: string, newSize: string) => void;

  // Customers
  customers: Customer[];
  updateCustomerNotes: (customerId: string, notes: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;

  // CMS
  banners: CMSBanner[];
  addBanner: (banner: Omit<CMSBanner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<CMSBanner>) => void;
  deleteBanner: (id: string) => void;
  announcement: CMSAnnouncement;
  updateAnnouncement: (updates: Partial<CMSAnnouncement>) => void;
  faqs: FAQItem[];
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, updates: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  // Reviews
  reviews: ProductReview[];
  moderateReview: (reviewId: string, status: ProductReview['status'], isFeatured?: boolean) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  deleteReview: (reviewId: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Global & Backup
  resetToDefaults: () => void;
  clearAllData: () => void;
  loadSampleData: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonData: string) => boolean;

  // Toast
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'boota_admin_products_v3_clean',
  ORDERS: 'boota_admin_orders_v3_clean',
  CUSTOMERS: 'boota_admin_customers_v3_clean',
  RETURNS: 'boota_admin_returns_v3_clean',
  CATEGORIES: 'boota_admin_categories_v3_clean',
  COUPONS: 'boota_admin_coupons_v3_clean',
  BANNERS: 'boota_admin_banners_v3_clean',
  ANNOUNCEMENT: 'boota_admin_announcement_v3_clean',
  FAQS: 'boota_admin_faqs_v3_clean',
  REVIEWS: 'boota_admin_reviews_v3_clean',
  LOGS: 'boota_admin_logs_v3_clean',
  SETTINGS: 'boota_admin_settings_v3_clean',
};

// Purge any old dummy data cache keys
if (typeof window !== 'undefined') {
  try {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('boota_admin_') && !k.includes('_v3_clean')) {
        localStorage.removeItem(k);
      }
    });
  } catch (e) {
    console.error('Failed to clean old storage keys', e);
  }
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [returns, setReturns] = useState<ReturnTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RETURNS);
    return saved ? JSON.parse(saved) : initialReturns;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [banners, setBanners] = useState<CMSBanner[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
    return saved ? JSON.parse(saved) : initialCMSBanners;
  });

  const [announcement, setAnnouncement] = useState<CMSAnnouncement>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT);
    return saved ? JSON.parse(saved) : initialAnnouncement;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
    return saved ? JSON.parse(saved) : initialFAQs;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : initialInventoryLogs;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(announcement));
  }, [announcement]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, type, message });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 3800);
  };

  // Product Actions
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Ensemble "${newProduct.title}" added to catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
    showToast('Product specifications updated successfully.');
  };

  const deleteProduct = (id: string) => {
    const item = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Removed "${item?.title || 'Product'}" from catalog.`, 'info');
  };

  // Inventory Adjustments
  const adjustStock = (
    productId: string,
    variantSku: string,
    change: number,
    reason: InventoryLog['reason'],
    notes?: string
  ) => {
    let affectedProduct: Product | undefined;
    let affectedVariant: ProductVariant | undefined;
    let newCalculatedStock = 0;

    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        affectedProduct = p;
        const updatedVariants = p.variants.map(v => {
          if (v.sku === variantSku) {
            affectedVariant = v;
            newCalculatedStock = Math.max(0, v.stock + change);
            return { ...v, stock: newCalculatedStock };
          }
          return v;
        });
        return { ...p, variants: updatedVariants, updatedAt: new Date().toISOString() };
      })
    );

    if (affectedProduct && affectedVariant) {
      const logEntry: InventoryLog = {
        id: `log-${Date.now()}`,
        productId,
        productTitle: affectedProduct.title,
        variantSku,
        size: affectedVariant.size,
        colorName: affectedVariant.colorName,
        change,
        newStock: newCalculatedStock,
        reason,
        notes: notes || `Stock updated manually (${change > 0 ? '+' : ''}${change})`,
        timestamp: new Date().toISOString(),
        performedBy: 'Current Store Admin'
      };
      setInventoryLogs(prev => [logEntry, ...prev]);
      showToast(`Stock for ${variantSku} adjusted by ${change > 0 ? `+${change}` : change} units (Now: ${newCalculatedStock}).`);
    }
  };

  // Order Actions
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o
      )
    );
    showToast(`Order ${orderId} marked as ${status.toUpperCase()}.`);
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o
      )
    );
    showToast(`Payment for ${orderId} updated to ${status.toUpperCase()}.`);
  };

  const updateOrderShipping = (orderId: string, carrier: string, trackingNumber: string, trackingUrl?: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              carrier,
              trackingNumber,
              trackingUrl: trackingUrl || (carrier.toLowerCase().includes('blue') ? `https://track.bluedart.com/${trackingNumber}` : `https://www.delhivery.com/track/package/${trackingNumber}`),
              orderStatus: 'shipped',
              updatedAt: new Date().toISOString()
            }
          : o
      )
    );
    showToast(`Dispatched ${orderId} via ${carrier} (AWB: ${trackingNumber}).`);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'cancelled',
              paymentStatus: o.paymentStatus === 'paid' ? 'refunded' : o.paymentStatus,
              notes: `${o.notes ? `${o.notes} | ` : ''}Cancelled: ${reason || 'Admin action'}`,
              updatedAt: new Date().toISOString()
            }
          : o
      )
    );
    showToast(`Order ${orderId} cancelled.`, 'info');
  };

  // Returns Actions
  const updateReturnStatus = (returnId: string, status: ReturnStatus, refundDetails?: { amount: number; txId?: string }) => {
    setReturns(prev =>
      prev.map(r => {
        if (r.id !== returnId) return r;
        return {
          ...r,
          status,
          refundAmount: refundDetails ? refundDetails.amount : r.refundAmount,
          refundTransactionId: refundDetails?.txId || r.refundTransactionId,
          updatedAt: new Date().toISOString()
        };
      })
    );
    showToast(`Return request ${returnId} updated to ${status}.`);
  };

  const processExchangeOrder = (returnId: string, newSize: string) => {
    const item = returns.find(r => r.id === returnId);
    if (!item) return;

    // Create replacement order
    const exchangeOrderId = `BOOTA-EX-${Math.floor(1000 + Math.random() * 9000)}`;
    setReturns(prev =>
      prev.map(r =>
        r.id === returnId
          ? {
              ...r,
              status: 'exchange_shipped',
              exchangeOrderId,
              updatedAt: new Date().toISOString()
            }
          : r
      )
    );
    showToast(`Exchange Order #${exchangeOrderId} created for size ${newSize}.`);
  };

  // Customers
  const updateCustomerNotes = (customerId: string, notes: string) => {
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, notes } : c))
    );
    showToast('Customer notes saved.');
  };

  // Categories
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCategory]);
    showToast(`Category "${newCategory.name}" created.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Category updated.');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted.', 'info');
  };

  // Coupons
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'timesUsed'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      timesUsed: 0
    };
    setCoupons(prev => [newCoupon, ...prev]);
    showToast(`Promo coupon "${newCoupon.code}" created.`);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Coupon details saved.');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon removed.', 'info');
  };

  const toggleCoupon = (id: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // CMS
  const addBanner = (bannerData: Omit<CMSBanner, 'id'>) => {
    const newBanner: CMSBanner = {
      ...bannerData,
      id: `ban-${Date.now()}`
    };
    setBanners(prev => [...prev, newBanner]);
    showToast('Homepage banner added.');
  };

  const updateBanner = (id: string, updates: Partial<CMSBanner>) => {
    setBanners(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
    showToast('Banner content updated.');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('Banner removed.', 'info');
  };

  const updateAnnouncement = (updates: Partial<CMSAnnouncement>) => {
    setAnnouncement(prev => ({ ...prev, ...updates }));
    showToast('Festive announcement bar updated.');
  };

  const addFAQ = (faqData: Omit<FAQItem, 'id'>) => {
    const newFAQ: FAQItem = {
      ...faqData,
      id: `faq-${Date.now()}`
    };
    setFaqs(prev => [...prev, newFAQ]);
    showToast('FAQ question published.');
  };

  const updateFAQ = (id: string, updates: Partial<FAQItem>) => {
    setFaqs(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
    showToast('FAQ entry saved.');
  };

  const deleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    showToast('FAQ removed.', 'info');
  };

  // Reviews
  const moderateReview = (reviewId: string, status: ProductReview['status'], isFeatured?: boolean) => {
    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? {
              ...r,
              status,
              isFeatured: isFeatured !== undefined ? isFeatured : r.isFeatured
            }
          : r
      )
    );
    showToast(`Review marked as ${status.toUpperCase()}.`);
  };

  const replyToReview = (reviewId: string, reply: string) => {
    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId ? { ...r, merchantReply: reply } : r
      )
    );
    showToast('Merchant reply posted to review.');
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    showToast('Review removed.', 'info');
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    showToast('Store settings saved successfully.');
  };

  // Global actions
  const clearAllData = () => {
    localStorage.clear();
    setProducts([]);
    setOrders([]);
    setCustomers([]);
    setReturns([]);
    setCategories([]);
    setCoupons([]);
    setBanners([]);
    setFaqs([]);
    setReviews([]);
    setInventoryLogs([]);
    showToast('All dummy records removed. Clean slate ready.');
  };

  const loadSampleData = () => {
    setProducts(sampleProducts);
    setOrders(sampleOrders);
    setCustomers(sampleCustomers);
    setCategories(sampleCategories);
    setCoupons(sampleCoupons);
    setBanners(sampleBanners);
    showToast('Sample kidswear catalog & orders loaded for testing.');
  };

  const resetToDefaults = () => {
    clearAllData();
  };

  const exportDatabaseJson = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      store: 'Boota Luxury Indian Festive Kidswear',
      products,
      orders,
      customers,
      returns,
      categories,
      coupons,
      banners,
      announcement,
      faqs,
      reviews,
      inventoryLogs,
      settings
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boota-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Admin catalog backup downloaded.');
  };

  const importDatabaseJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.customers) setCustomers(parsed.customers);
      if (parsed.returns) setReturns(parsed.returns);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.coupons) setCoupons(parsed.coupons);
      if (parsed.banners) setBanners(parsed.banners);
      if (parsed.announcement) setAnnouncement(parsed.announcement);
      if (parsed.faqs) setFaqs(parsed.faqs);
      if (parsed.reviews) setReviews(parsed.reviews);
      if (parsed.inventoryLogs) setInventoryLogs(parsed.inventoryLogs);
      if (parsed.settings) setSettings(parsed.settings);
      showToast('Database imported successfully.');
      return true;
    } catch {
      showToast('Invalid JSON file format.', 'error');
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        inventoryLogs,
        orders,
        updateOrderStatus,
        updatePaymentStatus,
        updateOrderShipping,
        cancelOrder,
        returns,
        updateReturnStatus,
        processExchangeOrder,
        customers,
        updateCustomerNotes,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCoupon,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        announcement,
        updateAnnouncement,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        reviews,
        moderateReview,
        replyToReview,
        deleteReview,
        settings,
        updateSettings,
        resetToDefaults,
        clearAllData,
        loadSampleData,
        exportDatabaseJson,
        importDatabaseJson,
        toast,
        showToast
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
