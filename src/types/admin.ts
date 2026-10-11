export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending_cod' | 'cod_collected' | 'refunded' | 'failed';
export type ReturnStatus = 'requested' | 'approved' | 'picked_up' | 'inspected' | 'refunded' | 'exchange_shipped' | 'rejected';
export type ReturnType = 'refund' | 'exchange' | 'store_credit';

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  size: string;
  sku: string;
  stock: number;
  reserved: number;
  lowStockThreshold: number;
  priceModifier?: number; // e.g. +₹200 for larger size
}

export interface SizeChartDimension {
  size: string;
  age: string;
  chestInches: number;
  topLengthInches: number;
  waistInches: number;
  bottomLengthInches: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  category: string;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  costPrice: number;
  gstRate: number; // 5 or 12
  hsnCode: string;
  status: 'published' | 'draft' | 'archived';
  description: string;
  fabric: string; // e.g., 'Pure Chanderi Silk', 'Banarasi Brocade'
  craft: string; // e.g., 'Hand Zari Zardozi', 'Gota Patti Scalloping'
  care: string;
  images: string[];
  variants: ProductVariant[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  sizeChart: SizeChartDimension[];
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productTitle: string;
  variantSku: string;
  size: string;
  colorName: string;
  change: number; // e.g. +10 or -2
  newStock: number;
  reason: 'restock' | 'sale' | 'return' | 'defect' | 'audit_adjustment' | 'manual';
  notes?: string;
  timestamp: string;
  performedBy: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sku: string;
  colorName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string; // e.g. "BOOTA-8942"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  gstAmount: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'razorpay_upi' | 'razorpay_card' | 'cod' | 'netbanking';
  shippingAddress: OrderAddress;
  carrier?: string; // BlueDart, Delhivery, etc.
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
  isGift?: boolean;
  giftMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnTicket {
  id: string; // e.g. "RET-1042"
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  type: ReturnType;
  items: {
    productId: string;
    productTitle: string;
    productImage: string;
    sku: string;
    size: string;
    requestedExchangeSize?: string;
    quantity: number;
    amount: number;
  }[];
  reason: 'Size Too Small' | 'Size Too Large' | 'Defect in Embroidery' | 'Arrived After Event' | 'Color Mismatch' | 'Other';
  reasonDetails?: string;
  photos?: string[];
  status: ReturnStatus;
  refundAmount?: number;
  refundTransactionId?: string;
  exchangeOrderId?: string;
  pickupCarrier?: string;
  pickupTracking?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  registeredDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  returnCount: number;
  tier: 'Royal VIP' | 'Frequent Festive' | 'New Patron' | 'At Risk';
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number; // 15% or ₹500
  minOrderValue: number;
  maxDiscountCap?: number;
  startDate: string;
  endDate: string;
  usageLimitTotal: number;
  usageLimitPerUser: number;
  timesUsed: number;
  isActive: boolean;
}

export interface CMSBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  badge?: string;
  position: 'hero_primary' | 'hero_secondary' | 'festive_mid_banner';
  isActive: boolean;
  displayOrder: number;
}

export interface CMSAnnouncement {
  id: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
  isActive: boolean;
  highlightText?: string;
}

export interface FAQItem {
  id: string;
  category: 'Sizing & Fit' | 'Festive Orders & Delivery' | 'Fabrics & Care' | 'Returns & Exchanges';
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  childAge?: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  isFeatured: boolean;
  verifiedPurchase: boolean;
  merchantReply?: string;
  photos?: string[];
}

export interface StoreSettings {
  storeName: string;
  brandTagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsappSupport: string;
  gstin: string;
  warehouseAddress: string;
  currency: string;
  currencySymbol: string;
  standardShippingFee: number;
  expressShippingFee: number;
  freeShippingThreshold: number;
  estimatedDispatchDays: number;
  razorpayKeyId: string;
  razorpayEnabled: boolean;
  codEnabled: boolean;
  codMaxOrderValue: number;
  defaultGstPercent: number;
  notifyOnNewOrderEmail: boolean;
  notifyOnLowStockEmail: boolean;
  whatsappDispatchAlerts: boolean;
}
