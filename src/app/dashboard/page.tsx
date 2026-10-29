import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassComponents';
import { LayoutDashboard, TrendingUp, Package, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Business Overview</h1>
            <p className="text-text-secondary">Welcome back! Here is what is happening today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Today: {new Date().toLocaleDateString()}</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Today's Sales" value="KES 45,200" icon={TrendingUp} color="text-success" />
          <StatCard title="Transactions" value="128" icon={LayoutDashboard} color="text-text-primary" />
          <StatCard title="Est. Gross Profit" value="KES 12,100" icon={WalletIcon} color="text-gold" />
          <StatCard title="Low Stock Alerts" value="5 Items" icon={AlertTriangle} color="text-warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="lg:col-span-2 p-6">
            <h3 className="text-xl font-semibold mb-6">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-text-secondary border-b border-white/10">
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Items</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <TableRow id="#ORD-9821" items="Tusker Lager x4" amount="KES 800" status="Paid" />
                  <TableRow id="#ORD-9820" items="Senator Keg (300ml) x2" amount="KES 200" status="Paid" />
                  <TableRow id="#ORD-9819" items="Kenya Cane (750ml) x1" amount="KES 1,200" status="Paid" />
                </tbody>
              </table>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-6">Fast Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="gold-button w-full justify-start flex gap-3">
                <ShoppingCart className="w-5 h-5" /> New Sale
              </button>
              <button className="glass-button w-full justify-start flex gap-3">
                <Package className="w-5 h-5" /> Receive Stock
              </button>
              <button className="glass-button w-full justify-start flex gap-3">
                <Users className="w-5 h-5" /> Staff Attendance
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <GlassCard className="p-6 flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-text-secondary text-sm">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </GlassCard>
  );
}

function TableRow({ id, items, amount, status }: any) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 font-mono text-xs text-text-secondary">{id}</td>
      <td className="py-4">{items}</td>
      <td className="py-4 font-medium">{amount}</td>
      <td className="py-4">
        <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
          {status}
        </span>
      </td>
    </tr>
  );
}

function WalletIcon(props: any) {
  return <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-white text-xs font-bold">K</div>;
}

import { ShoppingCart, Users, Wallet as WalletIconFromLucide } from 'lucide-react';
