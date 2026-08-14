import type { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import type { AnalyticsOverview } from '../interfaces/analytics.interface';
import type {
  CreateCouponDto,
  CreateReviewDto,
  InventoryQueryDto,
  ReviewQueryDto,
  UpdateCouponDto,
} from '../dto/operations.dto';

export interface OperationsRepository {
  getInventory(query: InventoryQueryDto): Promise<unknown>;
  getProductMovements(
    productId: string,
    query: PaginationQueryDto,
  ): Promise<unknown>;
  getAnalytics(): Promise<AnalyticsOverview>;
  createReview(
    userId: string,
    productId: string,
    input: CreateReviewDto,
  ): Promise<unknown>;
  getProductReviews(productId: string): Promise<unknown>;
  getReviews(query: ReviewQueryDto): Promise<unknown>;
  moderateReview(id: string, status: 'APPROVED' | 'REJECTED'): Promise<unknown>;
  getCoupons(): Promise<unknown>;
  getAvailableCoupons(): Promise<unknown>;
  createCoupon(input: CreateCouponDto): Promise<unknown>;
  updateCoupon(id: string, input: UpdateCouponDto): Promise<unknown>;
  deleteCoupon(id: string): Promise<void>;
}
