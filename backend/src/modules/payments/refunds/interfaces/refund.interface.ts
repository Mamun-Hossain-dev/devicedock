import type { PaginatedResult } from '../../../../common/interfaces/pagination.interface';
import type {
  CheckoutPaymentMethod,
  OrderStatus,
  PaymentStatus,
} from '../../interfaces/payment.interface';

export type RefundStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED';

export interface RefundView {
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
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
      paymentMethod: CheckoutPaymentMethod;
      totalAmount: number;
      status: OrderStatus;
    };
  };
}

export interface CreateRefundInput {
  providerRefundId: string;
  amount: number;
  reason: string | null;
  requestedById: string;
  idempotencyKey: string;
}

export interface RefundListQuery {
  page: number;
  limit: number;
  status?: RefundStatus;
  paymentId?: string;
}

export interface VerifiedRefundEvent {
  id: string;
  type: string;
  refundId?: string;
  paymentIntentId?: string;
  refundStatus?: RefundStatus;
  refundAmount?: number;
  currency?: string;
  refundReason?: string | null;
  failureCode?: string;
  failureMessage?: string;
  metadata?: Record<string, string>;
}

export interface RefundCompletedEvent {
  eventId: string;
  refundId: string;
  paymentId: string;
  orderId: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  reason: string | null;
  refundDate: string;
}

export interface RefundWebhookProcessingResult {
  duplicate: boolean;
  completedEvent?: RefundCompletedEvent;
}

export type RefundListResult = PaginatedResult<RefundView>;
