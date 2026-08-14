import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum DeliveryZoneDto {
  DHAKA = 'DHAKA',
  OUTSIDE_DHAKA = 'OUTSIDE_DHAKA',
}

export class SaveAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  label!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  recipientName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(7)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  @MinLength(5)
  addressLine!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  area!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @IsEnum(DeliveryZoneDto)
  deliveryZone!: DeliveryZoneDto;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isDefault?: boolean;
}

export class AddWishlistDto {
  @IsUUID()
  productId!: string;
}

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  orderUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  productUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  emailUpdates?: boolean;
}
