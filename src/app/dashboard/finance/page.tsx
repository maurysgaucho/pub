"use client";

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ArrowDownCircle, Wallet, Package, Calendar } from 'lucide-react';
import { GlassCard, GlassButton } from '@/components/ui/GlassComponents';
import { createClient } from '@/lib/supabase';

export default function FinancePage() {
  const [stats, setStats] = useState({
    revenue: 0,
    expenses: 0,
    grossProfit: 0,
    netProfit: 0
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadFinance() {
      // Logic to aggregate sales and expenses from DB
      // Mock values for UI demonstration
      setStats({
        revenue: 125000,
        expenses: 32000,
        grossProfit: 45000,
        netProfit: 13000
      });
      setLoading(false);
    }
    loadFinance();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Financial Reports</h1>
          <p className="text-text-secondary">Revenue, expenses, and profit analysis.</p>
        </div>
        <div className="flex gap-3">
          <GlassButton variant="glass" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </GlassButton>
          <GlassButton variant="gold" className="flex items-center gap-2">
            Export PDF
          </GlassButton>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceStatCard title="Total Revenue" value={`KES ${stats.revenue.toLocaleString()}`} icon={TrendingUp} color="text-success" />
        <FinanceStatCard title="Total Expenses" value={`KES ${stats.expenses.toLocaleString()}`} icon={ArrowDownCircle} color="text-error" />
        <FinanceStatCard title="Gross Profit" value={`KES ${stats.grossProfit.toLocaleString()}`} icon={Wallet} color="text-gold" />
        <FinanceStatCard title="Net Operating Profit" value={`KES ${stats.netProfit.toLocaleString()}`} icon={BarChart3} color="text-text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6">Revenue by Category</h3>
          <div className="space-y-4">
            <CategoryRow name="Beers" value={65000} percentage={52} color="bg-gold" />
            <CategoryRow name="Spirits" value={35000} percentage={28} color="bg-amber" />
            <CategoryRow name="Soft Drinks" value={15000} percentage={12} color="bg-white/20" />
            <CategoryRow name="Wines" value={10000} percentage={8} color="bg-white/20" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-6">Expense Breakdown</h3>
          <div className="space-y-4">
            <ExpenseRow name="Rent" value={15000} />
            <ExpenseRow name="Electricity" value={4000} />
            <ExpenseRow name="Staff Wages" value={10000} />
            <ExpenseRow name="Licenses" value={3000} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function FinanceStatCard({ title, value, icon: Icon, color }: any) {
  return (
    <GlassCard className="p-6 flex flex-col gap-4">
      <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-text-secondary text-sm">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </GlassCard>
  );
}

function CategoryRow({ name, value, percentage, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{name}</span>
        <span className="text-text-primary font-medium">KES {value.toLocaleString()} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function ExpenseRow({ name, value }: any) {
  return (
    <div className="flex justify-between py-3 border-b border-white/5 text-sm">
      <span className="text-text-secondary">{name}</span>
      <span className="text-text-primary font-bold">KES {value.toLocaleString()}</span>
    </div>
  );
}
