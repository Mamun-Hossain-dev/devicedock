import type { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import type {
  CheckoutPaymentMethod,
  OrderStatus,
  PaymentStatus,
} from '../../payments/interfaces/payment.interface';
import type { RefundStatus } from '../../payments/refunds/interfaces/refund.interface';

export type RefundRequestStatus = 'PENDING' | 'APPROVED' | 'DENIED';

export interface RefundRequestView {
  id: string;
  orderId: string;
  userId: string;
  reason: string;
  status: RefundRequestStatus;
  refundId: string | null;
  adminId: string | null;
  decisionNote: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    paymentMethod: CheckoutPaymentMethod;
  };
  refund: {
    id: string;
    amount: number;
    currency: string;
    status: RefundStatus;
  } | null;
}

export interface RefundableOrder {
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentId: string | null;
  paymentStatus: PaymentStatus | null;
  refundable: boolean;
}

export interface RefundRequestListQuery {
  page: number;
  limit: number;
  status?: RefundRequestStatus;
  orderId?: string;
}

export type RefundRequestListResult = PaginatedResult<RefundRequestView>;
