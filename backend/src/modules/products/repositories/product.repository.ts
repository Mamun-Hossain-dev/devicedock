import {
  CreateProductInput,
  NewProductImage,
  Product,
  ProductImage,
  UpdateProductInput,
  ProductListOptions,
  ProductCollections,
  CatalogOperationsSummary,
  StockAdjustment,
} from '../interfaces/product.interface';
import type { RepositoryPaginatedResult } from '../../../common/interfaces/pagination.interface';

export interface ProductRepository {
  findAll(
    options: ProductListOptions,
  ): Promise<RepositoryPaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  findCollections(limit: number): Promise<ProductCollections>;
  getOperationsSummary(): Promise<CatalogOperationsSummary>;
  adjustStock(
    id: string,
    quantity: number,
    adjustedById: string,
    reason: string,
  ): Promise<StockAdjustment | null>;
  create(
    input: CreateProductInput,
    images?: NewProductImage[],
  ): Promise<Product>;
  update(
    id: string,
    input: UpdateProductInput,
    images?: NewProductImage[],
  ): Promise<Product | null>;
  addImages(id: string, images: NewProductImage[]): Promise<Product | null>;
  findImage(productId: string, imageId: string): Promise<ProductImage | null>;
  deleteImage(productId: string, imageId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
