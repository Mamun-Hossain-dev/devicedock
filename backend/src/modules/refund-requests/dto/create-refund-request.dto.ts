import { IsString, IsUUID, Length } from 'class-validator';

export class CreateRefundRequestDto {
  @IsUUID()
  orderId!: string;

  @IsString()
  @Length(3, 500)
  reason!: string;
}
