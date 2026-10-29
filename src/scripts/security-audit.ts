import { createClient } from '@supabase/supabase-js';

async function runSecurityTest(tenantA_Key, tenantB_Key) {
  console.log('🚀 Starting Tenant Isolation Test...');

  const clientA = createClient(process.env.SUPABASE_URL, tenantA_Key);
  const clientB = createClient(process.env.SUPABASE_URL, tenantB_Key);

  // 1. Test: Tenant A tries to read Tenant B's products
  const { data: productsB } = await clientA
    .from('products')
    .select('*')
    .eq('tenant_id', 'TENANT_B_ID'); // Attempting to cross the boundary

  if (productsB && productsB.length > 0) {
    console.error('❌ SECURITY FAILURE: Tenant A accessed Tenant B\'s products!');
  } else {
    console.log('✅ SUCCESS: Tenant A blocked from Tenant B\'s products.');
  }

  // 2. Test: Tenant A tries to update Tenant B's stock
  const { error: updateError } = await clientA
    .from('products')
    .update({ current_stock: 999 })
    .eq('id', 'SOME_PRODUCT_B_ID');

  if (!updateError) {
    console.error('❌ SECURITY FAILURE: Tenant A updated Tenant B\'s stock!');
  } else {
    console.log('✅ SUCCESS: Tenant A blocked from updating Tenant B\'s stock.');
  }

  console.log('🏁 Security Test Complete.');
}

runSecurityTest();
