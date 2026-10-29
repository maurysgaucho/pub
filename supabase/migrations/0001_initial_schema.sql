-- ==========================================
-- 1. EXTENSIONS & CORE TYPES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role Enum
CREATE TYPE user_role AS ENUM ('platform_admin', 'business_admin', 'cashier', 'seller');

-- Order Status Enum
CREATE TYPE order_status AS ENUM ('draft', 'submitted', 'awaiting_payment', 'partially_paid', 'paid', 'cancelled', 'refunded');

-- Payment Method Enum
CREATE TYPE payment_method AS ENUM ('cash', 'mpesa', 'bank_transfer', 'card', 'other');

-- ==========================================
-- 2. TENANCY & IDENTITY
-- ==========================================

-- Tenants (The Businesses)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    subscription_tier TEXT DEFAULT 'trial',
    subscription_status TEXT DEFAULT 'active'
);

-- Business Profiles (Detailed info about the tenant)
CREATE TABLE business_profiles (
    tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    logo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    county TEXT,
    town TEXT,
    business_type TEXT,
    currency TEXT DEFAULT 'KES',
    timezone TEXT DEFAULT 'Africa/Nairobi',
    receipt_footer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles (Extends Supabase Auth users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant Memberships (Linking users to businesses and assigning roles)
CREATE TABLE tenant_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- ==========================================
-- 3. PRODUCT CATALOGUE & INVENTORY
-- ==========================================

CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    brand TEXT,
    sku TEXT,
    barcode TEXT,
    packaging_size TEXT,
    unit_of_measure TEXT,
    purchase_price DECIMAL(12,2) DEFAULT 0,
    selling_price DECIMAL(12,2) NOT NULL,
    wholesale_price DECIMAL(12,2),
    opening_stock DECIMAL(12,2) DEFAULT 0,
    current_stock DECIMAL(12,2) DEFAULT 0,
    reorder_level DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    old_price DECIMAL(12,2),
    new_price DECIMAL(12,2),
    changed_by UUID REFERENCES profiles(id),
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keg Management
CREATE TABLE keg_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    batch_number TEXT,
    total_volume_litres DECIMAL(10,2) NOT NULL,
    current_volume_litres DECIMAL(10,2) NOT NULL,
    purchase_cost DECIMAL(12,2),
    opened_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE serving_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    label TEXT NOT NULL, -- e.g., "Small Cup"
    volume_ml DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. SALES & POS
-- ==========================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id), -- Seller/Waiter
    confirmed_by UUID REFERENCES profiles(id), -- Cashier
    status order_status DEFAULT 'draft',
    table_number TEXT,
    customer_ref TEXT,
    notes TEXT,
    total_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    final_amount DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    serving_size_id UUID REFERENCES serving_sizes(id),
    keg_batch_id UUID REFERENCES keg_batches(id),
    quantity DECIMAL(12,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    method payment_method NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transaction_ref TEXT, -- M-Pesa Code
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- ==========================================
-- 5. SHIFTS & FINANCIALS
-- ==========================================

CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    cashier_id UUID REFERENCES profiles(id),
    opening_float DECIMAL(12,2) DEFAULT 0,
    opening_time TIMESTAMPTZ DEFAULT NOW(),
    closing_time TIMESTAMPTZ,
    closing_cash_counted DECIMAL(12,2),
    cash_surplus_shortage DECIMAL(12,2),
    reconciliation_notes TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'closed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    payment_date DATE DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. AUDIT & LOGS
-- ==========================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE keg_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE serving_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_my_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql STABLE;

-- RLS Policies Examples
-- (In a real Supabase env, these would be applied per table)

-- Tenants: Platform admins can see all, users can see their own
CREATE POLICY "Platform Admins see all tenants" ON tenants
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM tenant_memberships WHERE user_id = auth.uid() AND role = 'platform_admin')
    );

CREATE POLICY "Users see their own tenant" ON tenants
    FOR SELECT TO authenticated
    USING (id = get_my_tenant_id());

-- Business Data (Products, Orders, etc)
-- This is the "Wall" - every record must match the user's tenant_id
CREATE POLICY "Tenant Isolation Policy" ON products
    FOR ALL TO authenticated
    USING (tenant_id = get_my_tenant_id())
    WITH CHECK (tenant_id = get_my_tenant_id());

-- (Repeat similar patterns for all business tables...)
