import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import type { RefundRequestStatus } from '../interfaces/refund-request.interface';

export class RefundRequestQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'DENIED'])
  status?: RefundRequestStatus;

  @IsOptional()
  @IsUUID()
  orderId?: string;
}
