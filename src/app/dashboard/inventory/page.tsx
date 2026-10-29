"use client";

import React, { useState, useEffect } from 'react';
import { Package, Plus, ArrowDownCircle, History, AlertTriangle, Save } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/GlassComponents';
import { createClient } from '@/lib/supabase';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [receiveQty, setReceiveQty] = useState('');
  const [costPrice, setCostPrice] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function loadInventory() {
      const { data } = await supabase.from('products').select('*').order('name');
      setProducts(data || []);
      setLoading(false);
    }
    loadInventory();
  }, []);

  const handleReceiveStock = async () => {
    if (!selectedProduct || !receiveQty) return;

    // Update stock atomically using RPC or transaction (Simplified for now)
    const { data: product } = await supabase
      .from('products')
      .select('current_stock')
      .eq('id', selectedProduct.id)
      .single();

    const newStock = (product?.current_stock || 0) + parseFloat(receiveQty);

    await supabase
      .from('products')
      .update({ current_stock: newStock })
      .eq('id', selectedProduct.id);

    // Log movement for audit
    await supabase.from('audit_logs').insert({
      action: 'STOCK_RECEIVE',
      entity_type: 'product',
      entity_id: selectedProduct.id,
      new_value: { quantity: receiveQty, total: newStock }
    });

    setShowReceiveModal(false);
    setReceiveQty('');
    setCostPrice('');
    // Refresh data
    const { data: updated } = await supabase.from('products').select('*').order('name');
    setProducts(updated || []);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Inventory Management</h1>
          <p className="text-text-secondary">Track and update your beverage stock levels.</p>
        </div>
        <GlassButton variant="gold" onClick={() => setShowReceiveModal(true)}>
          <Plus className="w-5 h-5" /> Receive New Stock
        </GlassButton>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Inventory Table */}
        <GlassCard className="lg:col-span-3 p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-text-secondary border-b border-white/10 text-sm">
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">Brand</th>
                <th className="pb-4 font-medium text-center">Stock Level</th>
                <th className="pb-4 font-medium">Unit</th>
                <th className="pb-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium text-text-primary">{p.name}</td>
                  <td className="py-4 text-text-secondary">{p.brand}</td>
                  <td className="py-4 text-center">
                    <span className={`font-bold ${p.current_stock <= p.reorder_level ? 'text-warning' : 'text-text-primary'}`}>
                      {p.current_stock}
                    </span>
                  </td>
                  <td className="py-4 text-text-secondary">{p.unit_of_measure || 'Bottle'}</td>
                  <td className="py-4 text-right">
                    {p.current_stock <= p.reorder_level ? (
                      <span className="px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium flex items-center gap-1 justify-end">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium">Healthy</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {/* Quick Stats */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" /> Stock Alerts
            </h3>
            <div className="space-y-3">
              {products.filter(p => p.current_stock <= p.reorder_level).map(p => (
                <div key={p.id} className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs opacity-80">Currently {p.current_stock} - Reorder at {p.reorder_level}</p>
                </div>
              ))}
              {products.filter(p => p.current_stock <= p.reorder_level).length === 0 && (
                <p className="text-text-secondary text-sm italic">All stock levels healthy.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Receive Stock Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-md p-8 space-y-6">
            <h3 className="text-2xl font-bold text-center">Receive New Stock</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-text-secondary text-sm font-medium">Select Product</label>
                <select
                  className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold"
                  onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value))}
                >
                  <option value="">-- Choose Product --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.brand} {p.name}</option>)}
                </select>
              </div>
              <GlassInput
                label="Quantity to Receive"
                type="number"
                placeholder="e.g. 24"
                value={receiveQty}
                onChange={(e) => setReceiveQty(e.target.value)}
              />
              <GlassInput
                label="Cost Price (per unit)"
                type="number"
                placeholder="KES 0.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
              />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowReceiveModal(false)} className="flex-1 glass-button">Cancel</button>
                <button onClick={handleReceiveStock} className="flex-1 gold-button">Save Stock</button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
