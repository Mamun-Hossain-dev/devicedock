import type {
  CheckoutItemInput,
  CheckoutOptions,
  PaymentView,
  VerifiedPaymentEvent,
  WebhookProcessingResult,
} from '../interfaces/payment.interface';

export interface PaymentRepository {
  findById(paymentId: string): Promise<PaymentView | null>;
  findByIdempotencyKey(
    userId: string,
    idempotencyKey: string,
  ): Promise<PaymentView | null>;
  findActiveByUser(userId: string): Promise<PaymentView | null>;
  findByOrderId(orderId: string): Promise<PaymentView | null>;
  findOwnedById(userId: string, paymentId: string): Promise<PaymentView | null>;
  createPendingFromItems(
    userId: string,
    items: CheckoutItemInput[],
    options: CheckoutOptions,
    idempotencyKey: string,
    currency: string,
    minorUnit: number,
  ): Promise<PaymentView>;
  attachProviderIntent(
    paymentId: string,
    providerIntentId: string,
  ): Promise<PaymentView>;
  markCreationFailed(
    paymentId: string,
    code: string,
    message: string,
  ): Promise<void>;
  markCancelled(paymentId: string, reason: string): Promise<void>;
  markRefundedAndCancel(paymentId: string): Promise<void>;
  processWebhook(event: VerifiedPaymentEvent): Promise<WebhookProcessingResult>;
}
