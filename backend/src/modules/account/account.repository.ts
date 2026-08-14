import type { SaveAddressDto } from './dto/account.dto';

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface AccountRepository {
  listAddresses(userId: string): Promise<unknown[]>;
  createAddress(userId: string, input: SaveAddressDto): Promise<unknown>;
  updateAddress(
    userId: string,
    id: string,
    input: SaveAddressDto,
  ): Promise<unknown>;
  deleteAddress(userId: string, id: string): Promise<boolean>;
  listWishlist(userId: string): Promise<unknown[]>;
  addWishlist(userId: string, productId: string): Promise<unknown>;
  removeWishlist(userId: string, productId: string): Promise<boolean>;
  getNotificationPreferences(userId: string): Promise<unknown>;
  updateNotificationPreferences(
    userId: string,
    input: {
      orderUpdates?: boolean;
      productUpdates?: boolean;
      emailUpdates?: boolean;
    },
  ): Promise<unknown>;
  listNotifications(userId: string): Promise<unknown[]>;
  markNotificationRead(userId: string, id: string): Promise<boolean>;
  createNotification(
    userId: string,
    input: { type: string; title: string; message: string },
  ): Promise<void>;
}
