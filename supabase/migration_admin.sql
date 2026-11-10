-- ==============================================================================
-- 🛡️ Migration: Complete Admin Panel & Multi-Level Permissions Setup
-- Adds Admin Policies, RPC Functions, and Promotes Initial Admin
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. แต่งตั้งแอดมินคนแรก (aifullfill@gmail.com)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'aifullfill@gmail.com';

-- 2. สร้าง Policies ให้ Admin มีสิทธิ์เต็มที่ในการอ่านและแก้ไขทุกตาราง
-- ตาราง profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ตาราง user_subscriptions
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ตาราง user_api_keys
DROP POLICY IF EXISTS "Admins can manage all api keys" ON public.user_api_keys;
CREATE POLICY "Admins can manage all api keys" ON public.user_api_keys
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ตาราง courses
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
CREATE POLICY "Admins can manage all courses" ON public.courses
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ตาราง course_episodes
DROP POLICY IF EXISTS "Admins can manage all episodes" ON public.course_episodes;
CREATE POLICY "Admins can manage all episodes" ON public.course_episodes
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 3. ฟังก์ชันดึงรายชื่อผู้ใช้ทั้งหมดพร้อมข้อมูลสิทธิ์และอุปกรณ์สำหรับ Admin (Fast Admin Users Lookup)
CREATE OR REPLACE FUNCTION public.admin_get_users_list()
RETURNS TABLE (
  profile_id UUID,
  user_id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  sub_tier subscription_tier,
  sub_status subscription_status,
  sub_interval billing_interval,
  sub_end TIMESTAMPTZ,
  api_key_id UUID,
  key_prefix TEXT,
  max_devices INT,
  devices_count INT,
  devices JSONB,
  allowed_tools TEXT[]
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    p.id AS profile_id,
    p.user_id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.role,
    p.created_at,
    s.tier AS sub_tier,
    s.status AS sub_status,
    s.interval AS sub_interval,
    s.current_period_end AS sub_end,
    k.id AS api_key_id,
    k.key_prefix,
    COALESCE(k.max_devices, 2) AS max_devices,
    COALESCE(jsonb_array_length(k.devices), 0) AS devices_count,
    COALESCE(k.devices, '[]'::jsonb) AS devices,
    k.allowed_tools
  FROM public.profiles p
  LEFT JOIN LATERAL (
    SELECT * FROM public.user_subscriptions
    WHERE user_id = p.user_id
    ORDER BY created_at DESC
    LIMIT 1
  ) s ON true
  LEFT JOIN LATERAL (
    SELECT * FROM public.user_api_keys
    WHERE user_id = p.user_id
    ORDER BY created_at DESC
    LIMIT 1
  ) k ON true
  ORDER BY p.created_at DESC;
$$;

-- 4. ฟังก์ชันช่วยเหลือสำหรับ Admin ปรับแพ็กเกจสมาชิก
CREATE OR REPLACE FUNCTION public.admin_update_subscription(
  p_target_user_id UUID,
  p_tier subscription_tier,
  p_status subscription_status,
  p_interval billing_interval,
  p_period_end TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- ตรวจสอบว่าผู้เรียกฟังก์ชันเป็น Admin จริง
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can update subscriptions.';
  END IF;

  -- ทำการเพิ่มหรืออัปเดตสิทธิ์
  INSERT INTO public.user_subscriptions (user_id, tier, status, interval, current_period_end, updated_at)
  VALUES (p_target_user_id, p_tier, p_status, p_interval, p_period_end, now());
END;
$$;
