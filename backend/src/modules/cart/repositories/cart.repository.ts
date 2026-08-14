import type { Cart } from '../interfaces/cart.interface';

export interface CartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  setItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart>;
  removeItem(userId: string, productId: string): Promise<Cart>;
  clear(userId: string): Promise<Cart | null>;
}
