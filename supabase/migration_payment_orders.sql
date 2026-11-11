-- ==============================================================================
-- aifullfill.com : Payment Orders, Slip Verification (Pre-Approval) & Admin Review
-- ==============================================================================

-- 1. สร้างตารางคำสั่งซื้อและหลักฐานการโอนเงิน (Payment Orders)
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('monthly', 'yearly', 'lifetime')),
  plan_name TEXT NOT NULL,
  tier subscription_tier NOT NULL DEFAULT 'standard',
  interval billing_interval NOT NULL DEFAULT 'monthly',
  original_amount NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  net_amount NUMERIC(12,2) NOT NULL,
  affiliate_code TEXT,
  slip_url TEXT NOT NULL,
  transfer_amount NUMERIC(12,2) NOT NULL,
  transfer_date TEXT,
  transfer_time TEXT,
  sender_name TEXT,
  bank_ref_no TEXT,
  slip_qr_payload TEXT,
  slip_file_hash TEXT,
  slip_verify_status TEXT NOT NULL DEFAULT 'pending' CHECK (slip_verify_status IN ('verified_qr', 'pre_checked', 'warning', 'manual_review')),
  slip_verify_score INT NOT NULL DEFAULT 0,
  slip_verify_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pre_approved', 'pending_review', 'approved', 'rejected')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON public.payment_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_orders_unique_bank_ref 
  ON public.payment_orders(bank_ref_no) 
  WHERE bank_ref_no IS NOT NULL AND bank_ref_no <> '' AND status <> 'rejected';
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_orders_unique_qr_payload 
  ON public.payment_orders(slip_qr_payload) 
  WHERE slip_qr_payload IS NOT NULL AND slip_qr_payload <> '' AND status <> 'rejected';
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_orders_unique_file_hash 
  ON public.payment_orders(slip_file_hash) 
  WHERE slip_file_hash IS NOT NULL AND slip_file_hash <> '' AND status <> 'rejected';

-- 2. เปิดใช้งาน RLS บน payment_orders
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payment orders" ON public.payment_orders;
CREATE POLICY "Users can view own payment orders"
  ON public.payment_orders
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own payment orders" ON public.payment_orders;
CREATE POLICY "Users can insert own payment orders"
  ON public.payment_orders
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can manage all payment orders" ON public.payment_orders;
CREATE POLICY "Admins can manage all payment orders"
  ON public.payment_orders
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. สร้าง Storage Bucket สำหรับเก็บสลิปโอนเงิน (payment-slips)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-slips', 'payment-slips', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users can upload payment slips" ON storage.objects;
CREATE POLICY "Authenticated users can upload payment slips"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'payment-slips');

DROP POLICY IF EXISTS "Anyone can view payment slips" ON storage.objects;
CREATE POLICY "Anyone can view payment slips"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'payment-slips');

-- 4. ฟังก์ชันตรวจสอบคูปองส่วนลด / รหัสแนะนำพาร์ทเนอร์
CREATE OR REPLACE FUNCTION public.validate_affiliate_coupon(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_clean TEXT;
  v_aff RECORD;
BEGIN
  v_clean := UPPER(TRIM(COALESCE(p_code, '')));
  IF v_clean = '' THEN
    RETURN jsonb_build_object('valid', false, 'message', 'กรุณาระบุโค้ดส่วนลด');
  END IF;

  SELECT id, user_id, affiliate_code, custom_coupon_code, is_active
  INTO v_aff
  FROM public.affiliates
  WHERE is_active = true
    AND (UPPER(affiliate_code) = v_clean OR UPPER(custom_coupon_code) = v_clean)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'message', 'ไม่พบรหัสคูปองนี้ หรือคูปองหมดอายุ');
  END IF;

  IF auth.uid() IS NOT NULL AND v_aff.user_id = auth.uid() THEN
    RETURN jsonb_build_object('valid', false, 'message', 'ไม่สามารถใช้คูปองของตัวเองได้');
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'affiliate_code', v_aff.affiliate_code,
    'coupon_code', COALESCE(v_aff.custom_coupon_code, v_aff.affiliate_code),
    'discount_percent', 5,
    'message', 'ใช้คูปองส่วนลดพิเศษ 5% สำเร็จ!'
  );
END;
$$;

-- 5. ฟังก์ชันบันทึกการแจ้งโอน + ตรวจสลิปเบื้องต้น (Pre-Approve) เพื่อเปิดสิทธิ์เข้าเรียนทันที
CREATE OR REPLACE FUNCTION public.submit_payment_order(
  p_order_no TEXT,
  p_plan_id TEXT,
  p_plan_name TEXT,
  p_tier subscription_tier,
  p_interval billing_interval,
  p_original_amount NUMERIC,
  p_discount_amount NUMERIC,
  p_net_amount NUMERIC,
  p_affiliate_code TEXT,
  p_slip_url TEXT,
  p_transfer_amount NUMERIC,
  p_transfer_date TEXT,
  p_transfer_time TEXT,
  p_sender_name TEXT,
  p_bank_ref_no TEXT,
  p_slip_qr_payload TEXT,
  p_slip_file_hash TEXT,
  p_slip_verify_status TEXT,
  p_slip_verify_score INT,
  p_slip_verify_notes JSONB,
  p_is_pre_approved BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_order_id UUID;
  v_status TEXT;
  v_period_end TIMESTAMPTZ;
  v_existing_sub_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'กรุณาเข้าสู่ระบบก่อนแจ้งชำระเงิน';
  END IF;

  -- เช็คสลิปซ้ำด้วย bank_ref_no, slip_qr_payload หรือ slip_file_hash
  IF p_bank_ref_no IS NOT NULL AND TRIM(p_bank_ref_no) <> '' THEN
    IF EXISTS (
      SELECT 1 FROM public.payment_orders
      WHERE bank_ref_no = TRIM(p_bank_ref_no) AND status <> 'rejected'
    ) THEN
      RAISE EXCEPTION 'เลขที่อ้างอิงสลิปนี้เคยถูกใช้งานในระบบแล้ว กรุณาตรวจสอบอีกครั้ง';
    END IF;
  END IF;

  IF p_slip_qr_payload IS NOT NULL AND TRIM(p_slip_qr_payload) <> '' THEN
    IF EXISTS (
      SELECT 1 FROM public.payment_orders
      WHERE slip_qr_payload = TRIM(p_slip_qr_payload) AND status <> 'rejected'
    ) THEN
      RAISE EXCEPTION 'QR Code บนสลิปนี้เคยถูกใช้งานในระบบแล้ว (ป้องกันการใช้สลิปซ้ำ)';
    END IF;
  END IF;

  IF p_slip_file_hash IS NOT NULL AND TRIM(p_slip_file_hash) <> '' THEN
    IF EXISTS (
      SELECT 1 FROM public.payment_orders
      WHERE slip_file_hash = TRIM(p_slip_file_hash) AND status <> 'rejected'
    ) THEN
      RAISE EXCEPTION 'ไฟล์ภาพสลิปนี้เคยถูกอัปโหลดในระบบแล้ว กรุณาใช้สลิปใบใหม่';
    END IF;
  END IF;

  v_status := CASE WHEN p_is_pre_approved THEN 'pre_approved' ELSE 'pending_review' END;

  INSERT INTO public.payment_orders (
    order_no, user_id, plan_id, plan_name, tier, interval,
    original_amount, discount_amount, net_amount, affiliate_code,
    slip_url, transfer_amount, transfer_date, transfer_time, sender_name,
    bank_ref_no, slip_qr_payload, slip_file_hash,
    slip_verify_status, slip_verify_score, slip_verify_notes, status
  ) VALUES (
    p_order_no, v_user_id, p_plan_id, p_plan_name, p_tier, p_interval,
    p_original_amount, p_discount_amount, p_net_amount, NULLIF(TRIM(p_affiliate_code), ''),
    p_slip_url, p_transfer_amount, p_transfer_date, p_transfer_time, p_sender_name,
    NULLIF(TRIM(p_bank_ref_no), ''), NULLIF(TRIM(p_slip_qr_payload), ''), NULLIF(TRIM(p_slip_file_hash), ''),
    p_slip_verify_status, p_slip_verify_score, COALESCE(p_slip_verify_notes, '[]'::jsonb), v_status
  )
  RETURNING id INTO v_order_id;

  -- หากผ่านการตรวจสลิปเบื้องต้น (Pre-Approved) ให้เปิดสิทธิ์เข้าเรียนทันที (Provisional Access)
  IF p_is_pre_approved THEN
    IF p_interval = 'lifetime' THEN
      v_period_end := '2099-12-31T23:59:59Z'::timestamptz;
    ELSIF p_interval = 'yearly' THEN
      v_period_end := now() + INTERVAL '365 days';
    ELSE
      v_period_end := now() + INTERVAL '30 days';
    END IF;

    SELECT id INTO v_existing_sub_id
    FROM public.user_subscriptions
    WHERE user_id = v_user_id
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_existing_sub_id IS NOT NULL THEN
      UPDATE public.user_subscriptions
      SET tier = p_tier,
          status = 'active',
          interval = p_interval,
          stripe_subscription_id = 'PRE_APPROVED:' || p_order_no,
          current_period_end = v_period_end,
          updated_at = now()
      WHERE id = v_existing_sub_id;
    ELSE
      INSERT INTO public.user_subscriptions (
        user_id, tier, status, interval, stripe_subscription_id, current_period_end
      ) VALUES (
        v_user_id, p_tier, 'active', p_interval, 'PRE_APPROVED:' || p_order_no, v_period_end
      );
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_no', p_order_no,
    'status', v_status
  );
END;
$$;

-- 6. ฟังก์ชันสำหรับ Admin อนุมัติหรือปฏิเสธสลิป (พร้อมคำนวณค่าคอม Affiliate อัตโนมัติเมื่อ Approved)
CREATE OR REPLACE FUNCTION public.admin_review_payment_order(
  p_order_id UUID,
  p_action TEXT, -- 'approved' หรือ 'rejected'
  p_admin_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_period_end TIMESTAMPTZ;
  v_existing_sub_id UUID;
  v_aff RECORD;
  v_comm_amount NUMERIC(12,2);
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถอนุมัติสลิปได้';
  END IF;

  IF p_action NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'คำสั่งไม่ถูกต้อง (ต้องเป็น approved หรือ rejected)';
  END IF;

  SELECT * INTO v_order
  FROM public.payment_orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ไม่พบรายการแจ้งโอนนี้ในระบบ';
  END IF;

  -- อัปเดตสถานะใน payment_orders
  UPDATE public.payment_orders
  SET status = p_action,
      admin_note = COALESCE(p_admin_note, admin_note),
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      updated_at = now()
  WHERE id = p_order_id;

  IF p_action = 'approved' THEN
    -- 1) กำหนดวันหมดอายุสมาชิกตัวจริง
    IF v_order.interval = 'lifetime' THEN
      v_period_end := '2099-12-31T23:59:59Z'::timestamptz;
    ELSIF v_order.interval = 'yearly' THEN
      v_period_end := now() + INTERVAL '365 days';
    ELSE
      v_period_end := now() + INTERVAL '30 days';
    END IF;

    SELECT id INTO v_existing_sub_id
    FROM public.user_subscriptions
    WHERE user_id = v_order.user_id
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_existing_sub_id IS NOT NULL THEN
      UPDATE public.user_subscriptions
      SET tier = v_order.tier,
          status = 'active',
          interval = v_order.interval,
          stripe_subscription_id = 'APPROVED:' || v_order.order_no,
          current_period_end = v_period_end,
          updated_at = now()
      WHERE id = v_existing_sub_id;
    ELSE
      INSERT INTO public.user_subscriptions (
        user_id, tier, status, interval, stripe_subscription_id, current_period_end
      ) VALUES (
        v_order.user_id, v_order.tier, 'active', v_order.interval, 'APPROVED:' || v_order.order_no, v_period_end
      );
    END IF;

    -- 2) คำนวณและบันทึกค่าคอมมิชชั่นให้ Affiliate (ถ้ามีรหัสแนะนำ และยังไม่เคยจ่ายค่าคอมสำหรับ Order นี้)
    IF v_order.affiliate_code IS NOT NULL AND TRIM(v_order.affiliate_code) <> '' THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.affiliate_commissions WHERE order_id = v_order.order_no
      ) THEN
        SELECT * INTO v_aff
        FROM public.affiliates
        WHERE is_active = true
          AND (
            UPPER(affiliate_code) = UPPER(TRIM(v_order.affiliate_code))
            OR UPPER(custom_coupon_code) = UPPER(TRIM(v_order.affiliate_code))
          )
          AND user_id <> v_order.user_id
        LIMIT 1;

        IF FOUND THEN
          -- ผูก Referral ถาวร
          INSERT INTO public.affiliate_referrals (affiliate_id, referred_user_id, status)
          VALUES (v_aff.id, v_order.user_id, 'active')
          ON CONFLICT (referred_user_id) DO NOTHING;

          -- คำนวณค่าคอมมิชชั่น
          v_comm_amount := ROUND(v_order.net_amount * v_aff.commission_rate, 2);

          INSERT INTO public.affiliate_commissions (
            affiliate_id, referred_user_id, order_id, plan_name,
            order_amount, commission_rate, commission_amount, status
          ) VALUES (
            v_aff.id, v_order.user_id, v_order.order_no, v_order.plan_name,
            v_order.net_amount, v_aff.commission_rate, v_comm_amount, 'approved'
          );

          UPDATE public.affiliates
          SET total_earned = total_earned + v_comm_amount,
              current_balance = current_balance + v_comm_amount,
              updated_at = now()
          WHERE id = v_aff.id;
        END IF;
      END IF;
    END IF;

  ELSIF p_action = 'rejected' THEN
    -- หากสลิปถูกปฏิเสธ และเดิมเคยได้รับสิทธิ์ Pre-Approved จาก Order นี้ ให้ระงับสิทธิ์ทันที
    UPDATE public.user_subscriptions
    SET status = 'canceled',
        current_period_end = now(),
        updated_at = now()
    WHERE user_id = v_order.user_id
      AND (
        stripe_subscription_id = 'PRE_APPROVED:' || v_order.order_no
        OR stripe_subscription_id = 'APPROVED:' || v_order.order_no
      );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'status', p_action
  );
END;
$$;
