import type {
  PaginatedResult,
  PaginationOptions,
} from '../../../common/interfaces/pagination.interface';
import type {
  OrderView,
  PaymentSucceededEvent,
} from '../../payments/interfaces/payment.interface';
import type { AdminOrderQueryDto } from '../dto/admin-order-query.dto';

export interface OrderRepository {
  findAllByUser(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResult<OrderView>>;
  findById(userId: string, orderId: string): Promise<OrderView | null>;
  findAll(options: AdminOrderQueryDto): Promise<PaginatedResult<OrderView>>;
  findByIdForAdmin(orderId: string): Promise<OrderView | null>;
  updateStatus(
    orderId: string,
    status: OrderView['status'],
  ): Promise<OrderView>;
  deleteRemovable(orderId: string): Promise<boolean>;
  getInvoiceData(
    userId: string,
    orderId: string,
  ): Promise<PaymentSucceededEvent | null>;
  getInvoiceDataForAdmin(
    orderId: string,
  ): Promise<PaymentSucceededEvent | null>;
}
