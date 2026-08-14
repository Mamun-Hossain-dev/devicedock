import type { Product } from '../../products/interfaces/product.interface';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string | null;
  userId: string;
  items: CartItem[];
}

export interface CartView extends Cart {
  itemCount: number;
  subtotal: number;
}
