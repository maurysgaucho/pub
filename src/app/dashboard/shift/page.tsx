"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, LogIn, LogOut, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/GlassComponents';
import { createClient } from '@/lib/supabase';

export default function ShiftPage() {
  const [shiftStatus, setShiftStatus] = useState<'open' | 'closed' | 'none'>('none');
  const [currentShift, setCurrentShift] = useState<any>(null);
  const [openingFloat, setOpeningFloat] = useState('');
  const [closingCash, setClosingCash] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function checkShift() {
      const { data } = await supabase
        .from('shifts')
        .select('*')
        .eq('status', 'open')
        .single();

      if (data) {
        setCurrentShift(data);
        setShiftStatus('open');
      } else {
        setShiftStatus('none');
      }
      setLoading(false);
    }
    checkShift();
  }, []);

  const openShift = async () => {
    if (!openingFloat) return;

    const { data, error } = await supabase.from('shifts').insert({
      opening_float: parseFloat(openingFloat),
      status: 'open',
      opening_time: new Date().toISOString()
    }).select().single();

    if (error) return alert(error.message);

    setCurrentShift(data);
    setShiftStatus('open');
    setOpeningFloat('');
  };

  const closeShift = async () => {
    if (!closingCash) return;

    // In a real app, we would calculate expected cash from 'payments' table
    const expectedCash = 5000; // Mock value for now

    const { error } = await supabase
      .from('shifts')
      .update({
        closing_time: new Date().toISOString(),
        closing_cash_counted: parseFloat(closingCash),
        cash_surplus_shortage: parseFloat(closingCash) - expectedCash,
        status: 'closed',
        reconciliation_notes: notes
      })
      .eq('id', currentShift.id);

    if (error) return alert(error.message);

    setShiftStatus('closed');
    setClosingCash('');
    setNotes('');
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Shift Management</h1>
          <p className="text-text-secondary">Handle till openings and daily reconciliations.</p>
        </div>
        <div className={`px-4 py-1 rounded-full text-sm font-medium ${
          shiftStatus === 'open' ? 'bg-success/20 text-success' : 'bg-white/10 text-text-secondary'
        }`}>
          {shiftStatus === 'open' ? 'Shift Active' : 'No Active Shift'}
        </div>
      </header>

      {shiftStatus === 'none' ? (
        <GlassCard className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Open New Shift</h2>
            <p className="text-text-secondary">Please enter the opening float to start the till.</p>
          </div>
          <div className="max-w-xs mx-auto space-y-4">
            <GlassInput
              label="Opening Float (KES)"
              type="number"
              placeholder="e.g. 2000"
              value={openingFloat}
              onChange={(e) => setOpeningFloat(e.target.value)}
            />
            <GlassButton variant="gold" onClick={openShift} disabled={!openingFloat}>
              Open Till
            </GlassButton>
          </div>
        </GlassCard>
      ) : shiftStatus === 'open' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="w-6 h-6 text-gold" /> Shift Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-text-secondary">Opened At</span>
                <span className="text-text-primary">{new Date(currentShift.opening_time).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-text-secondary">Opening Float</span>
                <span className="text-text-primary font-bold">KES {currentShift.opening_float}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-secondary">Current Status</span>
                <span className="text-success font-medium">Active</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <LogOut className="w-6 h-6 text-error" /> Close Shift
            </h3>
            <div className="space-y-4">
              <GlassInput
                label="Actual Cash Counted (KES)"
                type="number"
                placeholder="Enter total cash in till"
                value={closingCash}
                onChange={(e) => setClosingCash(e.target.value)}
              />
              <GlassInput
                label="Reconciliation Notes"
                placeholder="Explain any shortages/surpluses"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <GlassButton variant="gold" onClick={closeShift} disabled={!closingCash}>
                Close & Reconcile
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      ) : (
        <GlassCard className="p-8 text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Shift Closed</h2>
          <p className="text-text-secondary">Your shift has been successfully reconciled.</p>
          <GlassButton variant="glass" onClick={() => window.location.reload()}>Refresh Status</GlassButton>
        </GlassCard>
      )}
    </div>
  );
}
