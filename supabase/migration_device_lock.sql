-- ==============================================================================
-- 🛡️ Migration: Dynamic Device Lock & Tool-Specific Entitlements
-- Adds configurable max_devices, devices array, and allowed_tools per API key
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. เพิ่มคอลัมน์ใหม่ในตาราง user_api_keys
ALTER TABLE public.user_api_keys 
ADD COLUMN IF NOT EXISTS max_devices INT NOT NULL DEFAULT 2,
ADD COLUMN IF NOT EXISTS devices JSONB NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS allowed_tools TEXT[] DEFAULT NULL;

-- 2. สร้าง Index สำหรับการค้นหาและตรวจสอบความเร็วสูง
CREATE INDEX IF NOT EXISTS idx_user_api_keys_devices ON public.user_api_keys USING GIN (devices);

-- 3. เพิ่มคำอธิบายคอลัมน์ (Comments)
COMMENT ON COLUMN public.user_api_keys.max_devices IS 'จำนวนเครื่องสูงสุดที่อนุญาตให้ใช้งาน (ปรับแต่งอิสระเป็นรายบุคคล เช่น 1, 2, 3, 5, 10)';
COMMENT ON COLUMN public.user_api_keys.devices IS 'รายการอุปกรณ์ที่ลงทะเบียนไว้จริง [{ id, name, first_seen, last_active }]';
COMMENT ON COLUMN public.user_api_keys.allowed_tools IS 'รายชื่อเครื่องมือที่อนุญาต เช่น {cine_movie_studio, cine_mv_studio}. หากเป็น NULL หมายถึงใช้ได้ทุกเครื่องมือตามแพ็กเกจสมาชิก';

-- 4. ฟังก์ชันช่วยเหลือสำหรับ Admin ในการรีเซ็ตอุปกรณ์ (Reset Devices Function)
CREATE OR REPLACE FUNCTION public.reset_user_devices(p_key_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_api_keys
  SET devices = '[]'::jsonb
  WHERE id = p_key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
