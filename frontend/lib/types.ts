export type Category =
  "MOBILE" | "LAPTOP" | "TABLET" | "AUDIO" | "WATCH" | "ACCESSORY";

export interface ProductImage {
  id: string;
  url: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  title: string;
  shortDescription: string | null;
  description: string;
  brand: string;
  category: Category;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  offerStartsAt: string | null;
  offerEndsAt: string | null;
  publishedAt: string;
  specifications: Record<string, string> | null;
  images: ProductImage[];
  stockMovements?: StockMovement[];
}

export interface StockMovement {
  id: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: string;
  createdAt: string;
  adjustedBy?: { name: string };
}

export interface CatalogOperationsSummary {
  categories: Array<{
    category: Category;
    productCount: number;
    stockCount: number;
  }>;
  brands: Array<{ brand: string; productCount: number; stockCount: number }>;
  inventory: {
    totalProducts: number;
    totalUnits: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  };
}

export interface InventoryPage extends PaginatedProducts {
  data: Array<Product & { stockMovements: StockMovement[] }>;
}

export interface StockMovementPage {
  data: StockMovement[];
  meta: PaginatedProducts["meta"];
}

export interface AnalyticsOverview {
  revenue: {
    total: number;
    today: number;
    last30Days: number;
    averageOrderValue: number;
  };
  orders: {
    total: number;
    last30Days: number;
    pendingFulfilment: number;
    byStatus: Record<OrderStatus, number>;
  };
  customers: {
    total: number;
    newLast30Days: number;
  };
  salesTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    productId: string | null;
    title: string;
    sku: string;
    unitsSold: number;
    revenue: number;
  }>;
  paymentSplit: {
    CARD: { count: number; amount: number };
    CASH_ON_DELIVERY: { count: number; amount: number };
  };
}

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";
export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  isVerified: boolean;
  createdAt: string;
  user: { name: string; email?: string };
  product: { id: string; title: string; sku: string };
}
export interface PaginatedReviews {
  data: Review[];
  meta: PaginatedProducts["meta"];
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minimumAmount: number;
  usageLimit: number | null;
  remainingUses: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export type PublicCoupon = Pick<
  Coupon,
  | "id"
  | "code"
  | "description"
  | "type"
  | "value"
  | "minimumAmount"
  | "remainingUses"
  | "endsAt"
>;

export interface ProductCollections {
  featured: Product[];
  newArrivals: Product[];
  offers: Product[];
  bestSellers: Product[];
  trending: Product[];
  brands: string[];
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export type Role = "USER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age?: number;
  role: Role;
  isBlocked: boolean;
  marketingConsent: boolean;
  profileImageUrl: string | null;
}

export interface PaginatedUsers {
  data: User[];
  meta: PaginatedProducts["meta"];
}

export interface AuthResult {
  accessToken: string;
  tokenType: "Bearer";
  user: User;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  area: string;
  city: string;
  postalCode: string | null;
  deliveryZone: "DHAKA" | "OUTSIDE_DHAKA";
  isDefault: boolean;
}

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export interface NotificationPreference {
  orderUpdates: boolean;
  productUpdates: boolean;
  emailUpdates: boolean;
}

export interface AccountNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface AuthSession {
  id: string;
  device: string;
  ip: string;
  userAgent: string;
  expiresAt: string;
  current: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ContactStatus = "NEW" | "IN_PROGRESS" | "RESOLVED";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  status: "ACTIVE" | "UNSUBSCRIBED";
  subscribedAt: string;
}

export interface NewsletterBroadcast {
  id: string;
  subject: string;
  previewText: string | null;
  content: string;
  status: "SENDING" | "SENT" | "PARTIAL" | "FAILED";
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  sentAt: string | null;
  createdAt: string;
}

export interface PaginatedContactMessages {
  data: ContactMessage[];
  meta: PaginatedProducts["meta"];
}

export interface PaginatedNewsletterSubscribers {
  data: NewsletterSubscriber[];
  meta: PaginatedProducts["meta"];
}

export interface PaginatedNewsletterBroadcasts {
  data: NewsletterBroadcast[];
  meta: PaginatedProducts["meta"];
}

export type PaymentStatus =
  "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "REFUNDED";

export type OrderStatus =
  | "PAYMENT_PENDING"
  | "PAYMENT_PROCESSING"
  | "PAID"
  | "COD_CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "PAYMENT_FAILED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string | null;
  productTitle: string;
  productSku: string;
  unitAmount: number;
  quantity: number;
  totalAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddressLine: string;
  deliveryArea: string;
  deliveryCity: string;
  deliveryPostalCode: string | null;
  couponCode: string | null;
  paymentMethod: "CARD" | "CASH_ON_DELIVERY";
  deliveryZone: "DHAKA" | "OUTSIDE_DHAKA";
  subtotalAmount: number;
  discountAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments?: Array<{ id: string; amount: number; status: PaymentStatus }>;
  refundRequests?: Array<{
    id: string;
    reason: string;
    status: RefundRequestStatus;
    decisionNote: string | null;
    reviewedAt: string | null;
    createdAt: string;
    refund: {
      id: string;
      amount: number;
      status: RefundStatus;
    } | null;
  }>;
}

export interface Payment {
  id: string;
  orderId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  failureCode: string | null;
  failureMessage: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  order: Order;
}

export interface CheckoutSession {
  paymentId: string;
  paymentIntentId: string;
  orderId: string;
  orderNumber: string;
  clientSecret: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod: "CARD" | "CASH_ON_DELIVERY";
  deliveryZone: "DHAKA" | "OUTSIDE_DHAKA";
  subtotalAmount: number;
  discountAmount: number;
  deliveryCharge: number;
  orderTotal: number;
  dueOnDelivery: number;
  items: OrderItem[];
}

export interface PaginatedOrders {
  data: Order[];
  meta: PaginatedProducts["meta"];
}

export type RefundStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export interface Refund {
  id: string;
  paymentId: string;
  providerRefundId: string | null;
  amount: number;
  currency: string;
  reason: string | null;
  status: RefundStatus;
  failureCode: string | null;
  failureMessage: string | null;
  requestedById: string | null;
  idempotencyKey: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  payment: {
    id: string;
    orderId: string;
    providerIntentId: string | null;
    status: PaymentStatus;
    amount: number;
    currency: string;
    order: {
      id: string;
      orderNumber: string;
      userId: string;
      customerName: string;
      customerEmail: string;
      paymentMethod: "CARD" | "CASH_ON_DELIVERY";
      totalAmount: number;
      status: OrderStatus;
    };
  };
}

export interface PaginatedRefunds {
  data: Refund[];
  meta: PaginatedProducts["meta"];
}

export type RefundRequestStatus = "PENDING" | "APPROVED" | "DENIED";

export interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  reason: string;
  status: RefundRequestStatus;
  refundId: string | null;
  adminId: string | null;
  decisionNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    paymentMethod: "CARD" | "CASH_ON_DELIVERY";
  };
  refund: {
    id: string;
    amount: number;
    currency: string;
    status: RefundStatus;
  } | null;
}

export interface PaginatedRefundRequests {
  data: RefundRequest[];
  meta: PaginatedProducts["meta"];
}
