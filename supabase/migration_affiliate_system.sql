-- ==============================================================================
-- aifullfill.com : Affiliate & Partner Program Database Schema
-- ==============================================================================

-- 1. ตารางพาร์ทเนอร์แนะนำ (Affiliates)
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE UNIQUE,
  affiliate_code TEXT NOT NULL UNIQUE,
  custom_coupon_code TEXT UNIQUE,
  tier TEXT NOT NULL DEFAULT 'standard', -- standard (10%), premium (15%), lifetime (25%)
  commission_rate NUMERIC(5,2) NOT NULL DEFAULT 0.10,
  total_earned NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  current_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliates_user ON public.affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(affiliate_code);

-- 2. ตารางผู้เรียนที่ผูกกับรหัสแนะนำ (Affiliate Referrals)
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aff_referrals_affiliate ON public.affiliate_referrals(affiliate_id);

-- 3. ตารางบันทึกค่าคอมมิชชั่นทุกครั้งที่มีการซื้อ (Affiliate Commissions)
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  order_id TEXT,
  plan_name TEXT NOT NULL,
  order_amount NUMERIC(12,2) NOT NULL,
  commission_rate NUMERIC(5,2) NOT NULL,
  commission_amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved', -- pending, approved, paid
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aff_commissions_affiliate ON public.affiliate_commissions(affiliate_id);

-- 4. ตารางคำขอถอนเงิน (Affiliate Payouts)
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  bank_name TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  bank_account_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  slip_url TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_aff_payouts_affiliate ON public.affiliate_payouts(affiliate_id);
