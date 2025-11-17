-- Additional performance indexes
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON order_items (product_id);
CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews (product_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews (user_id);
CREATE INDEX IF NOT EXISTS rider_reviews_rider_id_idx ON rider_reviews (rider_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications (user_id);
CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON notifications (user_id, is_read);
CREATE INDEX IF NOT EXISTS cart_user_id_idx ON cart (user_id);
CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON wishlist (user_id);
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants (product_id);
CREATE INDEX IF NOT EXISTS delivery_tracking_order_id_idx ON delivery_tracking (order_id);
CREATE INDEX IF NOT EXISTS delivery_tracking_rider_id_idx ON delivery_tracking (rider_id);
CREATE INDEX IF NOT EXISTS seller_payouts_seller_id_idx ON seller_payouts (seller_id);
CREATE INDEX IF NOT EXISTS platform_earnings_order_id_idx ON platform_earnings (order_id);
