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
  SizeChartDimension
} from '../types/admin';

export const standardSizeChart: SizeChartDimension[] = [
  { size: '0-6M', age: '0 - 6 Months', chestInches: 18, topLengthInches: 14, waistInches: 16, bottomLengthInches: 13 },
  { size: '6-12M', age: '6 - 12 Months', chestInches: 20, topLengthInches: 16, waistInches: 18, bottomLengthInches: 15 },
  { size: '1-2Y', age: '1 - 2 Years', chestInches: 22, topLengthInches: 18, waistInches: 20, bottomLengthInches: 18 },
  { size: '2-3Y', age: '2 - 3 Years', chestInches: 24, topLengthInches: 20, waistInches: 21, bottomLengthInches: 21 },
  { size: '3-4Y', age: '3 - 4 Years', chestInches: 25, topLengthInches: 22, waistInches: 22, bottomLengthInches: 23 },
  { size: '5-6Y', age: '5 - 6 Years', chestInches: 27, topLengthInches: 24, waistInches: 23, bottomLengthInches: 26 },
  { size: '7-8Y', age: '7 - 8 Years', chestInches: 29, topLengthInches: 26, waistInches: 24, bottomLengthInches: 29 },
  { size: '9-10Y', age: '9 - 10 Years', chestInches: 31, topLengthInches: 28, waistInches: 26, bottomLengthInches: 32 },
  { size: '11-12Y', age: '11 - 12 Years', chestInches: 33, topLengthInches: 30, waistInches: 28, bottomLengthInches: 35 },
];

// Cleared all dummy data as requested
export const initialProducts: Product[] = [];
export const initialOrders: Order[] = [];
export const initialCustomers: Customer[] = [];
export const initialReturns: ReturnTicket[] = [];
export const initialCategories: Category[] = [];
export const initialCoupons: Coupon[] = [];
export const initialCMSBanners: CMSBanner[] = [];

export const initialAnnouncement: CMSAnnouncement = {
  id: 'ann-1',
  message: '',
  linkText: '',
  linkUrl: '',
  isActive: false,
  highlightText: ''
};

export const initialFAQs: FAQItem[] = [];
export const initialReviews: ProductReview[] = [];
export const initialInventoryLogs: InventoryLog[] = [];

export const initialSettings: StoreSettings = {
  storeName: 'Boota',
  brandTagline: '',
  supportEmail: '',
  supportPhone: '',
  whatsappSupport: '',
  gstin: '',
  warehouseAddress: '',
  currency: 'INR',
  currencySymbol: '₹',
  standardShippingFee: 150,
  expressShippingFee: 350,
  freeShippingThreshold: 2999,
  estimatedDispatchDays: 2,
  razorpayKeyId: '',
  razorpayEnabled: true,
  codEnabled: true,
  codMaxOrderValue: 15000,
  defaultGstPercent: 12,
  notifyOnNewOrderEmail: true,
  notifyOnLowStockEmail: true,
  whatsappDispatchAlerts: true
};
