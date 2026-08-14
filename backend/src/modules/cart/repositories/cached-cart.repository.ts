import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../infrastructure/redis/redis.service';
import type { Cart } from '../interfaces/cart.interface';
import type { CartRepository } from './cart.repository';

@Injectable()
export class CachedCartRepository implements CartRepository {
  private readonly cacheTtlInSeconds = 60 * 10;

  constructor(
    private readonly redis: RedisService,
    private readonly repository: CartRepository,
  ) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    const cached = await this.redis.get(this.key(userId));
    if (cached) return JSON.parse(cached) as Cart;

    const cart = await this.repository.findByUserId(userId);
    if (cart) await this.cache(cart);
    return cart;
  }

  async setItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.repository.setItemQuantity(
      userId,
      productId,
      quantity,
    );
    await this.cache(cart);
    return cart;
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.repository.removeItem(userId, productId);
    await this.cache(cart);
    return cart;
  }

  async clear(userId: string): Promise<Cart | null> {
    const cart = await this.repository.clear(userId);
    await this.redis.del(this.key(userId));
    return cart;
  }

  private cache(cart: Cart): Promise<void> {
    return this.redis.set(
      this.key(cart.userId),
      JSON.stringify(cart),
      this.cacheTtlInSeconds,
    );
  }

  private key(userId: string): string {
    return `cart:user:${userId}`;
  }
}
