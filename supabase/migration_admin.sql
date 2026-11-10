-- ==============================================================================
-- 🛡️ Fix & Setup: Admin Privileges & Security Definer is_admin()
-- แก้ไข Infinite Recursion ของ RLS บนตาราง profiles พร้อมตั้งค่าสิทธิ์ Admin เต็มรูปแบบ
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. ฟังก์ชันตรวจสอบสิทธิ์ Admin แบบ Security Definer (ป้องกัน Infinite Recursion 100%)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. แต่งตั้ง aifullfill@gmail.com ให้เป็น Admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'aifullfill@gmail.com';

-- 3. รีเซ็ตและผูก Policies ใหม่สำหรับตาราง profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles 
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (public.is_admin());

-- 4. Policies สำหรับ user_subscriptions
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.user_subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions
FOR ALL USING (public.is_admin());

-- 5. Policies สำหรับ user_api_keys
DROP POLICY IF EXISTS "Admins can manage all api keys" ON public.user_api_keys;
CREATE POLICY "Admins can manage all api keys" ON public.user_api_keys
FOR ALL USING (public.is_admin());

-- 6. Policies สำหรับ courses
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
CREATE POLICY "Admins can manage all courses" ON public.courses
FOR ALL USING (public.is_admin());

-- 7. Policies สำหรับ course_episodes
DROP POLICY IF EXISTS "Admins can manage all episodes" ON public.course_episodes;
CREATE POLICY "Admins can manage all episodes" ON public.course_episodes
FOR ALL USING (public.is_admin());
