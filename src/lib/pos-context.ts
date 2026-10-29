import { createClient } from '@/lib/supabase';
import { UserRole } from '@/types';

export async function getPOSContext() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('tenant_id, role')
    .eq('user_id', user.id)
    .single();

  if (!membership) throw new Error('No tenant membership found');

  const { data: products } = await supabase
    .from('products')
    .select(`*, categories:product_categories(name)`)
    .eq('is_active', true);

  const { data: servingSizes } = await supabase
    .from('serving_sizes')
    .select(`*`);

  return {
    tenantId: membership.tenant_id,
    role: membership.role,
    products,
    servingSizes
  };
}
