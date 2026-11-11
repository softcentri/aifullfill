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

-- 5. เปิดใช้งาน Row Level Security (RLS) และ Policies สำหรับระบบ Affiliate
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users and admins can manage own affiliate"
  ON public.affiliates
  FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin())
  WITH CHECK ((SELECT auth.uid()) = user_id OR public.is_admin());

CREATE POLICY "Users and admins can view referrals"
  ON public.affiliate_referrals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = affiliate_id AND a.user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  );

CREATE POLICY "Admins can manage referrals"
  ON public.affiliate_referrals
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users and admins can view commissions"
  ON public.affiliate_commissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = affiliate_id AND a.user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  );

CREATE POLICY "Admins can manage commissions"
  ON public.affiliate_commissions
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users and admins can manage own payouts"
  ON public.affiliate_payouts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = affiliate_id AND a.user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = affiliate_id AND a.user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  );
