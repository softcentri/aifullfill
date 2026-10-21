# aifullfill.com - Project Specification & Blueprint

เอกสารรวบรวมข้อกำหนดสถาปัตยกรรมระบบ ฐานข้อมูล และอัตลักษณ์การออกแบบ (Visual Identity & Design System) สำหรับการพัฒนาแพลตฟอร์ม E-Learning **aifullfill.com**

---

## ส่วนที่ 1: พิมพ์เขียวสถาปัตยกรรมและฐานข้อมูล (Architecture & Database Blueprint)

### 1.1 แนวคิดหลัก (Core Concepts)
- **โมเดลธุรกิจ:** บุฟเฟต์ Subscription 2 ระดับ (Standard vs Premium)
  - **Standard Tier:** เข้าเรียนคอร์สพื้นฐานได้ไม่จำกัด
  - **Premium Tier:** เข้าเรียนได้ทุกคอร์ส (รวมคอร์สขั้นสูงและเวิร์กช็อป)
- **รอบบิล (Billing Intervals):**
  - รายเดือน (Monthly): `current_period_end` = วันชำระ + 30 วัน
  - รายปี (Yearly): `current_period_end` = วันชำระ + 365 วัน
  - ตลอดชีพ (Lifetime): `current_period_end` = `'2099-12-31'`
- **การเข้าชมฟรี (Free Preview):** ผู้ใช้ทั่วไปที่ยังไม่สมัคร สามารถดูบทเรียนที่ตั้งค่า `is_free_preview = true` ได้
- **สถาปัตยกรรมประสิทธิภาพสูง:**
  - ไม่เกิด N+1 Query ทุกรูปแบบ โดยใช้ Batch Query / Single Join Function
  - โครงสร้างตารางกระชับ รองรับ Supabase Free Tier และพร้อมขยายขนาด

---

### 1.2 โครงสร้างฐานข้อมูล (Database Schema - SQL Ready-to-Run)

```sql
-- 1. ตารางข้อมูลผู้ใช้ (Profiles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger ซิงค์ข้อมูลอัตโนมัติเมื่อ User สมัครใหม่ผ่าน Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. ตารางแพ็กเกจสมาชิก (User Subscriptions)
CREATE TYPE subscription_tier AS ENUM ('standard', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'expired', 'past_due');
CREATE TYPE billing_interval AS ENUM ('monthly', 'yearly', 'lifetime');

CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'standard',
  status subscription_status NOT NULL DEFAULT 'active',
  interval billing_interval NOT NULL DEFAULT 'monthly',
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ NOT NULL, -- ตลอดชีพ: '2099-12-31'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_user_subs_lookup ON public.user_subscriptions(user_id, status, current_period_end);

-- 3. ตารางคอร์สเรียน (Courses)
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  instructor TEXT NOT NULL DEFAULT 'AI Academy',
  required_tier subscription_tier NOT NULL DEFAULT 'standard', -- 'standard' หรือ 'premium'
  is_published BOOLEAN NOT NULL DEFAULT true,
  order_number INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_courses_published ON public.courses(is_published, order_number);

-- 4. ตารางตอนเรียน (Course Episodes)
CREATE TABLE public.course_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT, -- Bunny Stream / YouTube Unlisted
  duration_minutes INT DEFAULT 0,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  order_number INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_episodes_course ON public.course_episodes(course_id, order_number);

-- 5. ตารางความก้าวหน้าการเรียน (Progress)
CREATE TABLE public.user_episode_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.course_episodes(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, episode_id)
);
CREATE INDEX idx_progress_user_course ON public.user_episode_progress(user_id, course_id);

-- 6. ฟังก์ชันตรวจสอบสิทธิ์การเข้าถึงคอร์ส (Single Function Access Check)
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
```

---

### 1.3 กฎการตรวจสอบสิทธิ์ (Tier Hierarchy Logic)
* **ผู้ใช้ระดับ Premium:** เข้าเรียนได้ทุกคอร์ส (`standard` + `premium`)
* **ผู้ใช้ระดับ Standard:** เข้าเรียนได้เฉพาะคอร์สที่ระบุว่า `required_tier = 'standard'`
* **ผู้ใช้ทั่วไป (ยังไม่สมัคร):** ดูได้เฉพาะบทเรียนที่ตั้งค่า `is_free_preview = true`
* **Admin:** เข้าถึงได้ทุกคอร์สและทุกฟังก์ชัน

---

## ส่วนที่ 2: อัตลักษณ์แบรนด์และการออกแบบ (Visual Identity & Design System)

การออกแบบอิงตามหลัก **ทักษาปกรณ์วันอังคาร (30 ธันวาคม 2518 - ปีกระต่าย ธาตุไม้)** ผสานกับจิตวิทยา UX/UI แพลตฟอร์มการศึกษา AI:

### 2.1 กลยุทธ์ชุดสีมงคล (Color Palette Strategy - สัดส่วน 60-30-10)

| สัดส่วน (60-30-10) | โค้ดสี / โทนสี | หมวดมงคล (วันอังคาร) | การนำไปใช้และจิตวิทยาดีไซน์ |
| :--- | :--- | :--- | :--- |
| **60% (Base/Background)** | Dark Slate / Deep Navy-Black (`#0F172A`) หรือ Off-White นวล (`#F8FAFC`) | **หมวดเดช** (อำนาจ บารมี ความเชี่ยวชาญ) | ให้ความมั่นคง ล้ำลึก ทันสมัย สบายตา เป็นมืออาชีพ ลดความล้าของสายตาขณะเรียน |
| **30% (Secondary/Structure)** | Deep Forest / Emerald Glow (`#10B981`) | **หมวดมนตรี** (ผู้ใหญ่เมตตา อุปถัมภ์ เกื้อหนุน) & ส่งเสริมธาตุไม้ (ปีกระต่าย) | ใช้กับการ์ด, Badges, ไอคอน Success, จุดการันตีผลลัพธ์ ให้ความรู้สึกงอกงาม เติมเต็ม ผ่อนคลาย |
| **10% (Accent/CTA)** | Vibrant Sunset Orange / Coral (`#F97316`) | **หมวดศรี** (โชคลาภ การเงิน ความสมบูรณ์พูนสุข ค้าขายคล่อง) | ใช้กับปุ่ม Call to Action, ปุ่ม "สมัครบุฟเฟต์", ไฮไลต์ราคา, แถบโปรโมชั่น สื่อถึงพลังบวก ความคิดสร้างสรรค์ ชวนให้คลิก |

> **ข้อควรระวัง (หมวดกาลกิณี):** หลีกเลี่ยงสีขาวล้วนแบบสว่างจ้า (Pure Stark White `#FFFFFF`) ในพื้นที่ส่วนใหญ่ของหน้าเว็บ ให้ใช้เป็น Off-White, Creamy Pearl หรือ Gray-White อุ่นๆ แทน

---

### 2.2 รูปทรงและสไตล์กราฟิก (Geometric & Visual Form)
1. **รูปทรงโค้งมน (Rounded & Organic Shapes):**
   - หลีกเลี่ยงมุมเหลี่ยมคมจัด (ลดทอนพลังความใจร้อนของดาวสงครามในวันอังคาร)
   - ใช้ `rounded-xl`, `rounded-2xl`, `rounded-full` กับปุ่ม, การ์ดคอร์ส, และกล่องคอนเทนเนอร์ เพื่อสะท้อนความกลมกลืน นุ่มนวล และย่อยง่าย
2. **กราฟิก "ภาชนะที่กำลังเติมเต็ม" (Fulfillment & Inflow):**
   - สื่อความหมายของการ "ตักตวง / เติมเต็ม / ขยายกิ่งก้าน"
   - ใช้แสงออร่าเปล่งประกาย (Glowing Gradients) คลังความรู้ที่ไม่มีวันหมด
3. **ฟอนต์และตัวพิมพ์ (Typography):**
   - ใช้ฟอนต์แบบ **Sans-serif ตัวหนาปานกลาง ปลายมน สะอาดตา** (เช่น Prompt, Plus Jakarta Sans, หรือ Inter)
   - อ่านง่าย สื่อถึงผู้เชี่ยวชาญที่สอนเนื้อหากระชับ ชัดเจน ไม่เยิ่นเย้อ

---

### 2.3 โลโก้และเอกลักษณ์ของแบรนด์ (Logo Concept)
- **AI + FULLFILL:**
  - ตัวอักษร **i** หรือจุด **dot** บนตัว i ดีไซน์เป็น **ดวงไฟ/ประกายแสงสีส้ม** (ประกายปัญญา โชคลาภ และไอเดียใหม่)
  - คำว่า **Full** มีระดับสีหรือแถบสถานะคล้ายการ **"ชาร์จเต็ม" (Charging / Full Bar)** สื่อถึงระบบบุฟเฟต์ที่เติมเต็มความรู้ให้ผู้เรียนอย่างสมบูรณ์แบบ

---

## ส่วนที่ 3: หน้าเว็บหลักและฟีเจอร์ที่ต้องพัฒนา (Core Pages & Features)
1. **Landing Page:** Hero section สไตล์โมเดิร์น โทนสีมงคล พร้อมคอร์สเด่น และตารางเปรียบเทียบแพ็กเกจราคา
2. **Course Catalog:** หน้ารวมคอร์สพร้อมตัวกรอง/ค้นหา แสดงป้าย Standard / Premium ชัดเจน
3. **Course Player:** หน้าเรียนพร้อม Video Player (Bunny / YouTube Unlisted), รายการตอนเรียน, เช็คสิทธิ์การเข้าชม และระบบ Track ความคืบหน้า (`user_episode_progress`)
4. **Pricing & Subscription:** หน้ารับสมัครบุฟเฟต์ (รายเดือน / รายปี / ตลอดชีพ)
5. **User Dashboard:** จัดการบัญชี เช็ควันหมดอายุสมาชิก และประวัติการเรียน
