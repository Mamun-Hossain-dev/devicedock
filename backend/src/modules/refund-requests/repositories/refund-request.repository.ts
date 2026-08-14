import type { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import type {
  RefundableOrder,
  RefundRequestListQuery,
  RefundRequestView,
} from '../interfaces/refund-request.interface';

export interface RefundRequestRepository {
  create(
    userId: string,
    orderId: string,
    reason: string,
  ): Promise<RefundRequestView>;
  findById(requestId: string): Promise<RefundRequestView | null>;
  findOwnedById(
    userId: string,
    requestId: string,
  ): Promise<RefundRequestView | null>;
  findActiveForOrder(orderId: string): Promise<RefundRequestView | null>;
  findRefundableOrder(
    userId: string,
    orderId: string,
  ): Promise<RefundableOrder | null>;
  findAllForUser(
    userId: string,
    query: RefundRequestListQuery,
  ): Promise<PaginatedResult<RefundRequestView>>;
  findAllForAdmin(
    query: RefundRequestListQuery,
  ): Promise<PaginatedResult<RefundRequestView>>;
  approve(
    requestId: string,
    adminId: string,
    refundId: string,
    note: string | null,
  ): Promise<RefundRequestView | null>;
  deny(
    requestId: string,
    adminId: string,
    note: string | null,
  ): Promise<RefundRequestView | null>;
}
