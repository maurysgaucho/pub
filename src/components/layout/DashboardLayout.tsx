"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Profile, UserRole } from '@/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: membership } = await supabase
        .from('tenant_memberships')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (membership) {
        setUserRole(membership.role as UserRole);
      }
      setLoading(false);
    }
    loadUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <DashboardSidebar role={userRole || 'seller'} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
