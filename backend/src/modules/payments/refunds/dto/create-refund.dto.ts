import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import type { RefundStatus } from '../interfaces/refund.interface';

export class CreateRefundDto {
  @IsUUID()
  paymentId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount?: number;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  reason?: string;

  @IsUUID()
  idempotencyKey!: string;
}

export class RefundQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['PENDING', 'SUCCEEDED', 'FAILED'])
  status?: RefundStatus;

  @IsOptional()
  @IsUUID()
  paymentId?: string;
}
