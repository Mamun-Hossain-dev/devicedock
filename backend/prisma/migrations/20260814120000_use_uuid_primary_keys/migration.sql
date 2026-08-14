-- Existing integer identifiers are converted to deterministic UUIDv4 values so
-- every foreign key can be migrated without losing relationships. Prisma
-- generates UUIDv7 values for all new records after this migration.

BEGIN;

CREATE FUNCTION pg_temp.int_to_uuid(scope TEXT, value INTEGER)
RETURNS UUID
LANGUAGE SQL
IMMUTABLE
STRICT
AS $$
  SELECT (
    substr(hash, 1, 8) || '-' ||
    substr(hash, 9, 4) || '-4' ||
    substr(hash, 14, 3) || '-a' ||
    substr(hash, 18, 3) || '-' ||
    substr(hash, 21, 12)
  )::UUID
  FROM (SELECT md5(scope || ':' || value::TEXT) AS hash) AS digest;
$$;

-- Foreign keys must be removed while the referenced and referencing columns
-- are converted. They are restored with their original delete/update rules.
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_userId_fkey";
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_userId_fkey";
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_productId_fkey";
ALTER TABLE "notification_preferences" DROP CONSTRAINT "notification_preferences_userId_fkey";
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_productId_fkey";
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_adjustedById_fkey";
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_productId_fkey";
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_fkey";
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cartId_fkey";
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_productId_fkey";
ALTER TABLE "newsletter_subscribers" DROP CONSTRAINT "newsletter_subscribers_userId_fkey";
ALTER TABLE "newsletter_deliveries" DROP CONSTRAINT "newsletter_deliveries_broadcastId_fkey";
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_productId_fkey";
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";
ALTER TABLE "orders" DROP CONSTRAINT "orders_couponId_fkey";
ALTER TABLE "coupon_redemptions" DROP CONSTRAINT "coupon_redemptions_couponId_fkey";
ALTER TABLE "coupon_redemptions" DROP CONSTRAINT "coupon_redemptions_userId_fkey";
ALTER TABLE "coupon_redemptions" DROP CONSTRAINT "coupon_redemptions_orderId_fkey";
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";
ALTER TABLE "payments" DROP CONSTRAINT "payments_orderId_fkey";
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_paymentId_fkey";
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_requestedById_fkey";
ALTER TABLE "refund_requests" DROP CONSTRAINT "refund_requests_orderId_fkey";
ALTER TABLE "refund_requests" DROP CONSTRAINT "refund_requests_userId_fkey";
ALTER TABLE "refund_requests" DROP CONSTRAINT "refund_requests_refundId_fkey";
ALTER TABLE "refund_requests" DROP CONSTRAINT "refund_requests_adminId_fkey";

ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "addresses" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "wishlist_items" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "notification_preferences" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "notifications" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "stock_movements" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "product_images" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "carts" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "cart_items" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "contact_messages" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "newsletter_subscribers" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "newsletter_broadcasts" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "newsletter_deliveries" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "reviews" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "coupons" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "coupon_redemptions" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "order_items" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "refunds" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "refund_requests" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "payment_webhook_events" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "processed_consumer_events" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "users"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('users', "id");
ALTER TABLE "products"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('products', "id");
ALTER TABLE "addresses"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('addresses', "id"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId");
ALTER TABLE "wishlist_items"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('wishlist_items', "id"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId"),
  ALTER COLUMN "productId" TYPE UUID USING pg_temp.int_to_uuid('products', "productId");
ALTER TABLE "notification_preferences"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('notification_preferences', "id"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId");
ALTER TABLE "notifications"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('notifications', "id"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId");
ALTER TABLE "stock_movements"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('stock_movements', "id"),
  ALTER COLUMN "productId" TYPE UUID USING pg_temp.int_to_uuid('products', "productId"),
  ALTER COLUMN "adjustedById" TYPE UUID USING pg_temp.int_to_uuid('users', "adjustedById");
ALTER TABLE "product_images"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('product_images', "id"),
  ALTER COLUMN "productId" TYPE UUID USING pg_temp.int_to_uuid('products', "productId");
ALTER TABLE "carts"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('carts', "id"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId");
ALTER TABLE "cart_items"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('cart_items', "id"),
  ALTER COLUMN "cartId" TYPE UUID USING pg_temp.int_to_uuid('carts', "cartId"),
  ALTER COLUMN "productId" TYPE UUID USING pg_temp.int_to_uuid('products', "productId");
ALTER TABLE "contact_messages"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('contact_messages', "id");
ALTER TABLE "newsletter_subscribers"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('newsletter_subscribers', "id"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId");
ALTER TABLE "newsletter_broadcasts"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('newsletter_broadcasts', "id");
ALTER TABLE "newsletter_deliveries"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('newsletter_deliveries', "id"),
  ALTER COLUMN "broadcastId" TYPE UUID USING pg_temp.int_to_uuid('newsletter_broadcasts', "broadcastId");
ALTER TABLE "reviews"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('reviews', "id"),
  ALTER COLUMN "productId" TYPE UUID USING pg_temp.int_to_uuid('products', "productId"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId");
ALTER TABLE "coupons"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('coupons', "id");
ALTER TABLE "orders"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('orders', "id"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId"),
  ALTER COLUMN "couponId" TYPE UUID USING pg_temp.int_to_uuid('coupons', "couponId");
ALTER TABLE "coupon_redemptions"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('coupon_redemptions', "id"),
  ALTER COLUMN "couponId" TYPE UUID USING pg_temp.int_to_uuid('coupons', "couponId"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId"),
  ALTER COLUMN "orderId" TYPE UUID USING pg_temp.int_to_uuid('orders', "orderId");
ALTER TABLE "order_items"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('order_items', "id"),
  ALTER COLUMN "orderId" TYPE UUID USING pg_temp.int_to_uuid('orders', "orderId"),
  ALTER COLUMN "productId" TYPE UUID USING pg_temp.int_to_uuid('products', "productId");
ALTER TABLE "payments"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('payments', "id"),
  ALTER COLUMN "orderId" TYPE UUID USING pg_temp.int_to_uuid('orders', "orderId");
ALTER TABLE "refunds"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('refunds', "id"),
  ALTER COLUMN "paymentId" TYPE UUID USING pg_temp.int_to_uuid('payments', "paymentId"),
  ALTER COLUMN "requestedById" TYPE UUID USING pg_temp.int_to_uuid('users', "requestedById");
ALTER TABLE "refund_requests"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('refund_requests', "id"),
  ALTER COLUMN "orderId" TYPE UUID USING pg_temp.int_to_uuid('orders', "orderId"),
  ALTER COLUMN "userId" TYPE UUID USING pg_temp.int_to_uuid('users', "userId"),
  ALTER COLUMN "refundId" TYPE UUID USING pg_temp.int_to_uuid('refunds', "refundId"),
  ALTER COLUMN "adminId" TYPE UUID USING pg_temp.int_to_uuid('users', "adminId");
ALTER TABLE "payment_webhook_events"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('payment_webhook_events', "id");
ALTER TABLE "processed_consumer_events"
  ALTER COLUMN "id" TYPE UUID USING pg_temp.int_to_uuid('processed_consumer_events', "id");

DROP SEQUENCE IF EXISTS "users_id_seq";
DROP SEQUENCE IF EXISTS "products_id_seq";
DROP SEQUENCE IF EXISTS "addresses_id_seq";
DROP SEQUENCE IF EXISTS "wishlist_items_id_seq";
DROP SEQUENCE IF EXISTS "notification_preferences_id_seq";
DROP SEQUENCE IF EXISTS "notifications_id_seq";
DROP SEQUENCE IF EXISTS "stock_movements_id_seq";
DROP SEQUENCE IF EXISTS "product_images_id_seq";
DROP SEQUENCE IF EXISTS "carts_id_seq";
DROP SEQUENCE IF EXISTS "cart_items_id_seq";
DROP SEQUENCE IF EXISTS "contact_messages_id_seq";
DROP SEQUENCE IF EXISTS "newsletter_subscribers_id_seq";
DROP SEQUENCE IF EXISTS "newsletter_broadcasts_id_seq";
DROP SEQUENCE IF EXISTS "newsletter_deliveries_id_seq";
DROP SEQUENCE IF EXISTS "reviews_id_seq";
DROP SEQUENCE IF EXISTS "orders_id_seq";
DROP SEQUENCE IF EXISTS "coupons_id_seq";
DROP SEQUENCE IF EXISTS "coupon_redemptions_id_seq";
DROP SEQUENCE IF EXISTS "order_items_id_seq";
DROP SEQUENCE IF EXISTS "payments_id_seq";
DROP SEQUENCE IF EXISTS "refunds_id_seq";
DROP SEQUENCE IF EXISTS "refund_requests_id_seq";
DROP SEQUENCE IF EXISTS "payment_webhook_events_id_seq";
DROP SEQUENCE IF EXISTS "processed_consumer_events_id_seq";

ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_adjustedById_fkey" FOREIGN KEY ("adjustedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "newsletter_deliveries" ADD CONSTRAINT "newsletter_deliveries_broadcastId_fkey" FOREIGN KEY ("broadcastId") REFERENCES "newsletter_broadcasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_refundId_fkey" FOREIGN KEY ("refundId") REFERENCES "refunds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
