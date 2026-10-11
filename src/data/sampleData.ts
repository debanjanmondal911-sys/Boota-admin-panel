import {
  Product,
  Order,
  Customer,
  ReturnTicket,
  Category,
  Coupon,
  CMSBanner,
  FAQItem,
  ProductReview
} from '../types/admin';
import { standardSizeChart } from './initialData';

export const sampleCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Boys Festive',
    slug: 'boys-festive',
    description: 'Heritage hand-embroidered raw silk sherwanis, bandhani kurtas, and brocade bundi sets for boys.',
    bannerImage: '/src/assets/images/boota_sherwani_royal_1791696697914.jpg',
    displayOrder: 1,
    isActive: true,
    productCount: 2
  },
  {
    id: 'cat-2',
    name: 'Girls Festive',
    slug: 'girls-festive',
    description: 'Exquisite silk lehengas, pure chanderi anarkalis, and zari-embellished sharara ensembles.',
    bannerImage: '/src/assets/images/boota_lehenga_maroon_1791696710709.jpg',
    displayOrder: 2,
    isActive: true,
    productCount: 2
  },
  {
    id: 'cat-3',
    name: 'Festive Bundi Sets',
    slug: 'bundi-sets',
    description: 'Traditional Nehru jackets paired with silk kurtas and comfortable churidars.',
    bannerImage: '/src/assets/images/boota_kurta_bandhani_1791696723628.jpg',
    displayOrder: 3,
    isActive: true,
    productCount: 1
  }
];

export const sampleProducts: Product[] = [
  {
    id: 'prod-101',
    title: 'Nawabzada Raw Silk Sherwani Ensemble',
    slug: 'nawabzada-raw-silk-sherwani-ensemble',
    sku: 'BOOTA-B-SHW-01',
    category: 'Boys Festive',
    subcategory: 'Royal Sherwanis',
    price: 8490,
    compareAtPrice: 9990,
    costPrice: 3400,
    gstRate: 12,
    hsnCode: '62092000',
    status: 'published',
    description: 'Bespoke hand-tailored ivory raw silk sherwani for young princes. Features intricate antique gold zardozi dabka embroidery on bandhgala collar, cuffs, and placket. Lined with ultra-soft 100% mulmul cotton for gentle baby skin.',
    fabric: 'Pure Raw Silk with 100% Breathable Mulmul Cotton Lining',
    craft: 'Hand Zardozi, Gota Patti & Dabka Work',
    care: 'Dry Clean Only. Gentle steam press on reverse silk side.',
    images: [
      '/src/assets/images/boota_sherwani_royal_1791696697914.jpg'
    ],
    sizes: ['1-2Y', '2-3Y', '3-4Y', '5-6Y'],
    colors: [{ name: 'Royal Ivory & Antique Gold', hex: '#FAF7F0' }],
    variants: [
      { id: 'v-101-1', colorName: 'Royal Ivory & Antique Gold', colorHex: '#FAF7F0', size: '1-2Y', sku: 'BOOTA-SHW-IVR-12Y', stock: 6, reserved: 1, lowStockThreshold: 3 },
      { id: 'v-101-2', colorName: 'Royal Ivory & Antique Gold', colorHex: '#FAF7F0', size: '2-3Y', sku: 'BOOTA-SHW-IVR-23Y', stock: 4, reserved: 0, lowStockThreshold: 3 },
      { id: 'v-101-3', colorName: 'Royal Ivory & Antique Gold', colorHex: '#FAF7F0', size: '3-4Y', sku: 'BOOTA-SHW-IVR-34Y', stock: 2, reserved: 1, lowStockThreshold: 3 },
      { id: 'v-101-4', colorName: 'Royal Ivory & Antique Gold', colorHex: '#FAF7F0', size: '5-6Y', sku: 'BOOTA-SHW-IVR-56Y', stock: 5, reserved: 0, lowStockThreshold: 3 }
    ],
    sizeChart: standardSizeChart,
    isFeatured: true,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-08T14:30:00Z'
  },
  {
    id: 'prod-102',
    title: 'Gulnar Pure Silk Zari Lehenga Set',
    slug: 'gulnar-pure-silk-zari-lehenga-set',
    sku: 'BOOTA-G-LHG-02',
    category: 'Girls Festive',
    subcategory: 'Festive Lehengas',
    price: 9890,
    compareAtPrice: 11990,
    costPrice: 3900,
    gstRate: 12,
    hsnCode: '62092000',
    status: 'published',
    description: 'Crimson maroon handcrafted raw silk festive lehenga with intricate golden zari florals and shimmering gota patti borders. Lightweight gathered flare for effortless twirls. Accompanied by pure organza scalloped dupatta and pure silk choli.',
    fabric: 'Pure Silk Lehenga & Choli with Organza Dupatta and Soft Mul Lining',
    craft: 'Fine Zari Weaving, Hand Gota Patti & Mirror Accents',
    care: 'Dry Clean Only. Store in luxury muslin garment bag.',
    images: [
      '/src/assets/images/boota_lehenga_maroon_1791696710709.jpg'
    ],
    sizes: ['1-2Y', '2-3Y', '3-4Y', '5-6Y', '7-8Y'],
    colors: [{ name: 'Crimson Red & Royal Gold', hex: '#962949' }],
    variants: [
      { id: 'v-102-1', colorName: 'Crimson Red & Royal Gold', colorHex: '#962949', size: '1-2Y', sku: 'BOOTA-LHG-CRIM-12Y', stock: 5, reserved: 0, lowStockThreshold: 3 },
      { id: 'v-102-2', colorName: 'Crimson Red & Royal Gold', colorHex: '#962949', size: '2-3Y', sku: 'BOOTA-LHG-CRIM-23Y', stock: 3, reserved: 1, lowStockThreshold: 3 },
      { id: 'v-102-3', colorName: 'Crimson Red & Royal Gold', colorHex: '#962949', size: '3-4Y', sku: 'BOOTA-LHG-CRIM-34Y', stock: 1, reserved: 0, lowStockThreshold: 3 },
      { id: 'v-102-4', colorName: 'Crimson Red & Royal Gold', colorHex: '#962949', size: '5-6Y', sku: 'BOOTA-LHG-CRIM-56Y', stock: 4, reserved: 0, lowStockThreshold: 3 },
      { id: 'v-102-5', colorName: 'Crimson Red & Royal Gold', colorHex: '#962949', size: '7-8Y', sku: 'BOOTA-LHG-CRIM-78Y', stock: 3, reserved: 0, lowStockThreshold: 3 }
    ],
    sizeChart: standardSizeChart,
    isFeatured: true,
    createdAt: '2026-09-18T11:20:00Z',
    updatedAt: '2026-10-09T09:15:00Z'
  }
];

export const sampleOrders: Order[] = [
  {
    id: 'ORD-9842',
    customerId: 'CUST-104',
    customerName: 'Ananya Singhania',
    customerEmail: 'ananya.singhania@gmail.com',
    customerPhone: '+91 98201 44589',
    orderStatus: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'razorpay_upi',
    subtotal: 9890,
    shippingFee: 0,
    discount: 500,
    couponCode: 'FESTIVE500',
    gstAmount: 1127,
    total: 9390,
    items: [
      {
        id: 'item-102',
        productId: 'prod-102',
        productTitle: 'Gulnar Pure Silk Zari Lehenga Set',
        productImage: '/src/assets/images/boota_lehenga_maroon_1791696710709.jpg',
        sku: 'BOOTA-LHG-CRIM-23Y',
        colorName: 'Crimson Red & Royal Gold',
        size: '2-3Y',
        quantity: 1,
        unitPrice: 9890,
        totalPrice: 9890
      }
    ],
    shippingAddress: {
      fullName: 'Ananya Singhania',
      phone: '+91 98201 44589',
      email: 'ananya.singhania@gmail.com',
      addressLine1: 'Bungalow 14, Altamount Road',
      addressLine2: 'Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      country: 'India'
    },
    isGift: true,
    giftMessage: 'Happy 2nd Birthday to our dearest princess Tara! With lots of love from Maasi.',
    createdAt: '2026-10-10T14:32:00Z',
    updatedAt: '2026-10-10T14:35:00Z'
  }
];

export const sampleCustomers: Customer[] = [
  {
    id: 'CUST-104',
    fullName: 'Ananya Singhania',
    email: 'ananya.singhania@gmail.com',
    phone: '+91 98201 44589',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400026',
    registeredDate: '2026-08-15',
    tier: 'Royal VIP',
    totalOrders: 3,
    totalSpent: 28470,
    lastOrderDate: '10 Oct 2026',
    returnCount: 0,
    notes: 'Child Age: 2-3Y (Daughter: Tara). High-profile patron. Prefers royal maroon and ivory tones. Requests premium gift box packaging with silk ribbon.'
  }
];

export const sampleCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'FESTIVE500',
    description: 'Flat ₹500 off on festive orders above ₹4,999',
    discountType: 'fixed_amount',
    discountValue: 500,
    minOrderValue: 4999,
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    usageLimitTotal: 500,
    usageLimitPerUser: 1,
    timesUsed: 1,
    isActive: true
  }
];

export const sampleBanners: CMSBanner[] = [
  {
    id: 'ban-1',
    title: 'The Royal Diwali Atelier Edit',
    subtitle: 'Handcrafted zari lehengas, nawabi sherwanis, and pure silk kurta sets for little heirs.',
    badge: 'Festive 2026 Collection',
    imageUrl: '/src/assets/images/boota_banner_festive_1791696746200.jpg',
    ctaText: 'Explore Royal Edit',
    ctaLink: '/collections/boys-festive',
    position: 'hero_primary',
    displayOrder: 1,
    isActive: true
  }
];
