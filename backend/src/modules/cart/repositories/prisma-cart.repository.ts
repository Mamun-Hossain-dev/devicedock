import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import type { Cart } from '../interfaces/cart.interface';
import type { CartRepository } from './cart.repository';

const cartInclude = {
  items: {
    orderBy: { createdAt: 'asc' as const },
    include: {
      product: {
        include: { images: { orderBy: { createdAt: 'asc' as const } } },
      },
    },
  },
};

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<Cart | null> {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }

  async setItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    await this.prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      create: { cartId: cart.id, productId, quantity },
      update: { quantity },
    });

    return (await this.findByUserId(userId)) as Cart;
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id, productId },
      });
    }

    return (
      (await this.findByUserId(userId)) ?? {
        id: null,
        userId,
        items: [],
      }
    );
  }

  async clear(userId: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return null;

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.findByUserId(userId);
  }
}
