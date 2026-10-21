-- ==============================================================================
-- aifullfill.com : Complete Database Schema (SQL Ready-to-Run)
-- แพลตฟอร์ม E-Learning บุฟเฟต์ AI + คลังโค้ด + ระบบคุมสิทธิ์ MCP Server & AI Agent
-- ==============================================================================

-- 1. ตารางข้อมูลผู้ใช้ (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger ซิงค์ข้อมูลโปรไฟล์อัตโนมัติเมื่อ User สมัครใหม่ผ่าน Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. ประเภทข้อมูลสำหรับระบบสมาชิก (Enums)
DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('standard', 'premium');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'expired', 'past_due');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE billing_interval AS ENUM ('monthly', 'yearly', 'lifetime');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. ตารางแพ็กเกจสมาชิก (User Subscriptions)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'standard',
  status subscription_status NOT NULL DEFAULT 'active',
  interval billing_interval NOT NULL DEFAULT 'monthly',
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ NOT NULL, -- ตลอดชีพให้ใส่วันที่ '2099-12-31'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_subs_lookup ON public.user_subscriptions(user_id, status, current_period_end);

-- 4. ตารางคอร์สเรียน และโปรเจกต์ (Courses & Projects)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  instructor TEXT NOT NULL DEFAULT 'AI Academy',
  content_type TEXT NOT NULL DEFAULT 'course', -- 'course', 'project', 'tool'
  required_tier subscription_tier NOT NULL DEFAULT 'standard', -- standard หรือ premium
  github_repo_url TEXT,
  demo_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  order_number INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published, order_number);

-- 5. ตารางตอนเรียน (Course Episodes)
CREATE TABLE IF NOT EXISTS public.course_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT, -- Bunny Stream / YouTube Unlisted
  duration_minutes INT DEFAULT 0,
  is_free_preview BOOLEAN NOT NULL DEFAULT false, -- ตอนให้ทดลองดูฟรี
  order_number INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_episodes_course ON public.course_episodes(course_id, order_number);

-- 6. ตารางไฟล์แนบและเอกสารประกอบการเรียน (Course Attachments)
CREATE TABLE IF NOT EXISTS public.course_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.course_episodes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'zip',
  file_size TEXT,
  order_number INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_attachments_lookup ON public.course_attachments(course_id, episode_id);

-- 7. ตารางความก้าวหน้าการเรียน (Progress)
CREATE TABLE IF NOT EXISTS public.user_episode_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.course_episodes(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, episode_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON public.user_episode_progress(user_id, course_id);

-- 8. ระบบควบคุมสิทธิ์ MCP Servers & AI Agent (ป้องกันการคัดลอก / ละเมิดสิทธิ์)
CREATE TABLE IF NOT EXISTS public.mcp_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,                -- เช่น 'classroom-toolkit'
  name TEXT NOT NULL,
  description TEXT,
  required_tier subscription_tier NOT NULL DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT true,  -- Master Kill-Switch
  min_version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default Agent Key',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_lookup ON public.user_api_keys(key_hash, is_active);

-- 9. ฟังก์ชันเช็คสิทธิ์การเข้าถึงคอร์ส (Single Function Access Check ป้องกัน N+1)
CREATE OR REPLACE FUNCTION public.has_course_access(p_course_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.user_subscriptions s ON s.user_id = p_user_id
    WHERE c.id = p_course_id
      AND s.status = 'active'
      AND s.current_period_end > now()
      AND (
        s.tier = 'premium'
        OR (s.tier = 'standard' AND c.required_tier = 'standard')
      )
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = p_user_id AND role = 'admin'
  );
$$;

-- 10. เปิดใช้งาน Row Level Security (RLS) เพื่อความปลอดภัย
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_episode_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Policies พื้นฐาน
-- 1) Profiles: ดูได้ทุกคน / แก้ไขได้เฉพาะของตัวเอง
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- 2) Courses & Episodes: สาธารณะอ่านได้เฉพาะคอร์สที่เผยแพร่แล้ว
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Course episodes are viewable by everyone" ON public.course_episodes FOR SELECT USING (true);
CREATE POLICY "Course attachments are viewable by everyone" ON public.course_attachments FOR SELECT USING (true);

-- 3) Subscriptions & Progress & API Keys: ผู้ใช้ดูได้เฉพาะของตนเอง
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view and manage own progress" ON public.user_episode_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view and manage own API keys" ON public.user_api_keys FOR ALL USING (auth.uid() = user_id);
