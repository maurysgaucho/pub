# 🍻 BarSync - Multi-Tenant Bar & Pub Management System

Professional SaaS platform for Kenyan hospitality businesses to manage sales, inventory, and financials.

## 🚀 Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4.
- **Backend:** Supabase (PostgreSQL, Auth, Storage).
- **UI:** Glassmorphism Design System (Charcoal/Gold/Amber).

## 🛠️ Setup Instructions

### 1. Supabase Configuration
1. Create a new Supabase project.
2. Run the migrations in `/supabase/migrations` in the SQL Editor.
3. Configure the following environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`

### 2. Local Development
\`\`\`bash
npm install
npm run dev
\`\`\`

## 🔐 Security Architecture
- **Tenant Isolation:** Enforced via PostgreSQL Row Level Security (RLS).
- **Role-Based Access:** Defined as `platform_admin`, `business_admin`, `cashier`, and `seller`.
- **Auth:** Managed by Supabase Auth with JWT session validation.

## 📦 Core Modules
- **POS:** Fast, touch-optimized cashier screen with M-Pesa reference capture.
- **Inventory:** Real-time stock tracking with "Low Stock" alerts.
- **Kegs:** Volume-based tracking for draught beers (ml-precision).
- **Finance:** Shift-based reconciliation and net profit reporting.

## 🚢 Deployment
1. Push to GitHub.
2. Connect repository to Vercel.
3. Set environment variables in Vercel Project Settings.
4. Deploy.

---
Designed & Developed by **Digi Experts**
Build verified on Thu Oct 29 17:24:46 EAST 2026
