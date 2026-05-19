-- ============================================================
--  MarketPro — Supabase SQL Schema
--  Run this in Supabase SQL Editor to set up the database
-- ============================================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'merchant', 'admin')),
  whatsapp    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MERCHANTS
CREATE TABLE IF NOT EXISTS merchants (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_name        TEXT NOT NULL,
  store_description TEXT,
  store_logo        TEXT,
  whatsapp          TEXT NOT NULL,
  is_verified       BOOLEAN DEFAULT false,
  rating            NUMERIC(3,2) DEFAULT 0,
  total_sales       INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id   UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  old_price     NUMERIC(10,2),
  category      TEXT NOT NULL CHECK (category IN ('electronics','fashion','home','food','beauty','sports','other')),
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  images        TEXT[] DEFAULT '{}',
  video_url     TEXT,
  colors        TEXT[] DEFAULT '{}',
  sizes         TEXT[] DEFAULT '{}',
  rating        NUMERIC(3,2) DEFAULT 0,
  review_count  INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  is_featured   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id),
  merchant_id      UUID NOT NULL REFERENCES merchants(id),
  items            JSONB NOT NULL DEFAULT '[]',
  subtotal         NUMERIC(10,2) NOT NULL,
  shipping         NUMERIC(10,2) DEFAULT 0,
  discount         NUMERIC(10,2) DEFAULT 0,
  total            NUMERIC(10,2) NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_method   TEXT NOT NULL DEFAULT 'cash_on_delivery'
                   CHECK (payment_method IN ('card','whatsapp','bank_transfer','cash_on_delivery')),
  shipping_address JSONB NOT NULL DEFAULT '{}',
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- 6. WISHLIST
CREATE TABLE IF NOT EXISTS wishlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 7. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           TEXT UNIQUE NOT NULL,
  discount_type  TEXT NOT NULL CHECK (discount_type IN ('percentage','fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order      NUMERIC(10,2) DEFAULT 0,
  max_uses       INTEGER DEFAULT 100,
  used_count     INTEGER DEFAULT 0,
  expires_at     TIMESTAMPTZ,
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_merchant    ON products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_active      ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured    ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user          ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant      ON orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product      ON reviews(product_id);

-- ── Auto-update updated_at ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated   BEFORE UPDATE ON orders   FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Auto-create profile on signup ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles(id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Helper: decrement stock safely ────────────────────────────────────────
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET stock = GREATEST(0, stock - qty) WHERE id = product_id;
END; $$ LANGUAGE plpgsql;

-- ── Update product rating on review ──────────────────────────────────────
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating       = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*)                        FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_rating AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- ── Row Level Security ────────────────────────────────────────────────────
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews   ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist  ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: anyone can view active, only merchant can edit
CREATE POLICY "products_select" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (
  merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
);
CREATE POLICY "products_update" ON products FOR UPDATE USING (
  merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
);

-- Orders: users see own orders, merchants see their store orders
CREATE POLICY "orders_select_user"     ON orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_select_merchant" ON orders FOR SELECT USING (
  merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());

-- Reviews
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());

-- Wishlist
CREATE POLICY "wishlist_all" ON wishlist USING (user_id = auth.uid());

-- ── Sample data ───────────────────────────────────────────────────────────
INSERT INTO coupons(code, discount_type, discount_value, min_order, max_uses) VALUES
  ('FREE2025',  'fixed',      9.99,  0,   1000),
  ('SAVE20',    'percentage', 20,    50,  500),
  ('WELCOME10', 'percentage', 10,    0,   200)
ON CONFLICT(code) DO NOTHING;
