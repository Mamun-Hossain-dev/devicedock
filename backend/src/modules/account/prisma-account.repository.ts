import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AccountRepository } from './account.repository';
import type { SaveAddressDto } from './dto/account.dto';

const productInclude = { images: { orderBy: { createdAt: 'asc' as const } } };

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  listAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(userId: string, input: SaveAddressDto) {
    return this.prisma.$transaction(async (prisma) => {
      const count = await prisma.address.count({ where: { userId } });
      const isDefault = input.isDefault || count === 0;
      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }
      return prisma.address.create({
        data: { ...input, isDefault, userId },
      });
    });
  }

  async updateAddress(userId: string, id: string, input: SaveAddressDto) {
    return this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.address.findFirst({
        where: { id, userId },
      });
      if (!existing) return null;
      if (input.isDefault) {
        await prisma.address.updateMany({
          where: { userId, id: { not: id } },
          data: { isDefault: false },
        });
      }
      return prisma.address.update({
        where: { id },
        data: input,
      });
    });
  }

  async deleteAddress(userId: string, id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.address.findFirst({
        where: { id, userId },
      });
      if (!existing) return false;
      await prisma.address.delete({ where: { id } });
      if (existing.isDefault) {
        const next = await prisma.address.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        if (next) {
          await prisma.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }
      return true;
    });
  }

  listWishlist(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: { userId, product: { status: 'ACTIVE' } },
      orderBy: { createdAt: 'desc' },
      include: { product: { include: productInclude } },
    });
  }

  addWishlist(userId: string, productId: string) {
    return this.prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
      include: { product: { include: productInclude } },
    });
  }

  async removeWishlist(userId: string, productId: string) {
    const result = await this.prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });
    return result.count > 0;
  }

  getNotificationPreferences(userId: string) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  updateNotificationPreferences(
    userId: string,
    input: {
      orderUpdates?: boolean;
      productUpdates?: boolean;
      emailUpdates?: boolean;
    },
  ) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: input,
      create: { userId, ...input },
    });
  }

  listNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async markNotificationRead(userId: string, id: string) {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
    return result.count > 0;
  }

  async createNotification(
    userId: string,
    input: { type: string; title: string; message: string },
  ) {
    await this.prisma.notification.create({ data: { userId, ...input } });
  }
}
