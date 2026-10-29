import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  BarChart3,
  Wallet,
  Beer
} from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function DashboardSidebar({ role }: { role: string }) {
  const menuItems = {
    platform_admin: [
      { name: 'Global Overview', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Business Directory', icon: Users, href: '/dashboard/tenants' },
      { name: 'Subscriptions', icon: Wallet, href: '/dashboard/subscriptions' },
      { name: 'System Settings', icon: Settings, href: '/dashboard/settings' },
    ],
    business_admin: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'POS / Sales', icon: ShoppingCart, href: '/dashboard/pos' },
      { name: 'Inventory', icon: Package, href: '/dashboard/inventory' },
      { name: 'Keg Management', icon: Beer, href: '/dashboard/kegs' },
      { name: 'Staff Management', icon: Users, href: '/dashboard/staff' },
      { name: 'Financials', icon: BarChart3, href: '/dashboard/finance' },
      { name: 'Business Settings', icon: Settings, href: '/dashboard/settings' },
    ],
    cashier: [
      { name: 'POS Screen', icon: ShoppingCart, href: '/dashboard/pos' },
      { name: 'My Shift', icon: Wallet, href: '/dashboard/shift' },
      { name: 'Sales History', icon: BarChart3, href: '/dashboard/sales' },
    ],
    seller: [
      { name: 'Take Order', icon: ShoppingCart, href: '/dashboard/pos' },
      { name: 'My Orders', icon: LayoutDashboard, href: '/dashboard/my-orders' },
    ],
  };

  const currentMenu = menuItems[role as keyof typeof menuItems] || menuItems.seller;

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-surface border-r border-white/10">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-text-primary">
          Bar<span className="text-gold">Sync</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {currentMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-glass transition-all duration-200 group"
          >
            <item.icon className="w-5 h-5 group-hover:text-gold transition-colors" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            const supabase = createClient();
            supabase.auth.signOut().then(() => window.location.href = '/login');
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 w-full transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
