export type UserRole = 'platform_admin' | 'business_admin' | 'cashier' | 'seller';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  subscription_tier: string;
}

export interface TenantMembership {
  tenant_id: string;
  user_id: string;
  role: UserRole;
}
