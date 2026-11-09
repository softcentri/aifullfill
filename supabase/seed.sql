-- ==============================================================================
-- aifullfill.com : Master Curriculum Seed Data (อ้างอิงจาก D:\aifullfill\curriculum\MASTER_ROADMAP.md)
-- ผู้สอนหลัก: อาจารย์อั๋น (AIEbookAcademy / ebookcourse)
-- ปรัชญา: Maximum Output, Minimum Cost | Desktop Agents | Open Source | Core Ecosystems
-- ==============================================================================

-- 1. เพิ่ม/อัปเดต 9 คอร์สหลักสำหรับวันเปิดตัว (Day-1 Launch)
INSERT INTO public.courses (
  title, 
  slug, 
  description, 
  instructor, 
  required_tier, 
  content_type, 
  is_published, 
  order_number
)
VALUES
  -- หมวด 1: AI Creator & Visual Production
  (
    'Course 101: AI E-Book & Digital Asset Masterclass (ลายเซ็นอาจารย์อั๋น)',
    'course-101-ai-ebook-masterclass',
    'ผลิต E-Book และสื่อดิจิทัลแบบ Full Pipeline ครบวงจรโดยแทบไม่มีต้นทุนเครื่องมือ ออกแบบปก 3D Mockup จัดรูปเล่มพร้อมขายทำเงิน',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'standard',
    'course',
    true,
    1
  ),
  (
    'Course 102: ComfyUI Zero-to-Hero: คุมงานภาพและกราฟิกระดับเทพแบบฟรี 100%',
    'course-102-comfyui-zero-to-hero',
    'ปลดแอกค่าสมาชิก Midjourney ด้วย ComfyUI ในเครื่อง คุม Character หน้าตรง คุมแสง Inpainting แก้เฉพาะจุดด้วย Flux & SDXL',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'standard',
    'course',
    true,
    2
  ),
  (
    'Course 103: AI Video Production: Google Flow, Grok Video & Minimax',
    'course-103-ai-video-production',
    'ผลิตคลิปไวรัลและคลิปเล่าเรื่องคุณภาพสูง ด้วยต้นทุนที่ถูกที่สุด ผ่าน Google Flow, Grok Video, Minimax (Video/Voice) และ CapCut',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'standard',
    'course',
    true,
    3
  ),

  -- หมวด 2: Desktop Agents & Vibe Coding
  (
    'Course 201: Desktop Agent Mastery (Antigravity & Cowork / Codex)',
    'course-201-desktop-agent-mastery',
    'ปูพื้นฐานการใช้ Desktop Agent ทำงานแทนมนุษย์ อ่าน-แก้-สร้างไฟล์ในเครื่อง สั่งงานแบบโปรเจกต์เดียวจบ ติดตั้งสภาพแวดล้อมพร้อมใช้',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'standard',
    'course',
    true,
    4
  ),
  (
    'Course 202: Vibe Coding สร้าง Web Application ด้วย Desktop Agent + Supabase',
    'course-202-vibe-coding-web-app',
    'สร้างเว็บพร้อมระบบฐานข้อมูลและระบบล็อกอิน โดยสั่งงานผ่าน Desktop Agent (Antigravity / Codex) แบบ Non-coder ไร้ปัญหา N+1 Query',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'premium',
    'course',
    true,
    5
  ),
  (
    'Course 203: สร้าง Micro-Tools & Chrome Extensions ใช้เองและแจก/ขาย',
    'course-203-micro-tools-chrome-extensions',
    'ให้ Desktop Agent เสกเครื่องมือช่วยงานขนาดเล็ก และปลั๊กอินเบราว์เซอร์สำหรับช่วยงานเฉพาะทางเพื่อสร้างรายได้',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'premium',
    'course',
    true,
    6
  ),

  -- หมวด 3: Smart Automations, Hermes & Local AI
  (
    'Course 301: Local LLM Unleashed: รัน AI ฟรี ไม่จำกัด ไม่ง้อเน็ต ไม่ง้อ API',
    'course-301-local-llm-unleashed',
    'ติดตั้ง DeepSeek / Llama ผ่าน Ollama ในคอมพิวเตอร์ตัวเอง ใช้งานข้อมูลลับส่วนตัว ปลอดภัยสูงสุด และฟรี 100% ตลอดชีพ',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'standard',
    'course',
    true,
    7
  ),
  (
    'Course 302: AI Automation with Grokbot & Hermes Agent',
    'course-302-ai-automation-hermes-grokbot',
    'สร้างระบบออโตเมชันเฝ้าติดตามข้อมูล ทำคอนเทนต์อัตโนมัติ และรันงาน Background ด้วย Hermes & grokbot',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'premium',
    'course',
    true,
    8
  ),

  -- หมวด 4: Monetization
  (
    'Course 401: Lean AI Monetization: ลงทุนต่ำที่สุด กำไรเต็มเม็ดเต็มหน่วย',
    'course-401-lean-ai-monetization',
    'แผนการสร้างรายได้จากทักษะ AI แบบ Cost-effective: ขาย Digital Assets, รับทำเว็บด้วย Vibe Coding, รับงานวิดีโอ พร้อม Offer Blueprint',
    'อาจารย์อั๋น (AIEbookAcademy)',
    'standard',
    'course',
    true,
    9
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  instructor = EXCLUDED.instructor,
  required_tier = EXCLUDED.required_tier,
  order_number = EXCLUDED.order_number,
  is_published = EXCLUDED.is_published;

-- 2. เพิ่มตอนเรียนตัวอย่างและไฟล์แนบสำหรับ Course 101, 102, 201, 202
DO $$
DECLARE
  v_c101 UUID;
  v_c102 UUID;
  v_c201 UUID;
  v_c202 UUID;
BEGIN
  SELECT id INTO v_c101 FROM public.courses WHERE slug = 'course-101-ai-ebook-masterclass' LIMIT 1;
  SELECT id INTO v_c102 FROM public.courses WHERE slug = 'course-102-comfyui-zero-to-hero' LIMIT 1;
  SELECT id INTO v_c201 FROM public.courses WHERE slug = 'course-201-desktop-agent-mastery' LIMIT 1;
  SELECT id INTO v_c202 FROM public.courses WHERE slug = 'course-202-vibe-coding-web-app' LIMIT 1;

  -- ตอนเรียน Course 101
  IF v_c101 IS NOT NULL THEN
    DELETE FROM public.course_episodes WHERE course_id = v_c101;
    INSERT INTO public.course_episodes (course_id, title, video_url, duration_minutes, is_free_preview, order_number)
    VALUES
      (v_c101, 'EP.1 ปรัชญา Lean AI: ผลิต E-Book คุณภาพสูงในต้นทุน 0 บาท', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 25, true, 1),
      (v_c101, 'EP.2 วางโครงสร้างสารบัญและ Mindmap เนื้อหาด้วย Claude & ChatGPT', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 35, false, 2),
      (v_c101, 'EP.3 การเขียนเนื้อหาเจาะลึกและจัดรูปเล่มอัตโนมัติด้วย Desktop Agent', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 45, false, 3),
      (v_c101, 'EP.4 ทำปก E-Book 3D Mockup และภาพประกอบด้วย ComfyUI ฟรี', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 30, false, 4),
      (v_c101, 'EP.5 การส่งออกไฟล์ ePub, PDF และวางระบบขายบนแพลตฟอร์มดิจิทัล', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 20, false, 5);

    DELETE FROM public.course_attachments WHERE course_id = v_c101;
    INSERT INTO public.course_attachments (course_id, title, file_url, file_type, file_size, order_number)
    VALUES
      (v_c101, 'Template E-Book สำเร็จรูปพร้อมขาย + System Prompts.zip', 'https://example.com/ebook-templates.zip', 'zip', '12.4 MB', 1);
  END IF;

  -- ตอนเรียน Course 202 (Vibe Coding)
  IF v_c202 IS NOT NULL THEN
    DELETE FROM public.course_episodes WHERE course_id = v_c202;
    INSERT INTO public.course_episodes (course_id, title, video_url, duration_minutes, is_free_preview, order_number)
    VALUES
      (v_c202, 'EP.1 แนวคิด Vibe Coding: สั่ง Desktop Agent สร้าง Web App จากภาษาพูด', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 30, true, 1),
      (v_c202, 'EP.2 การติดตั้ง Next.js, Tailwind CSS และ Supabase Free Tier', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 20, false, 2),
      (v_c202, 'EP.3 ออกแบบฐานข้อมูลไร้ N+1 Query และตั้งค่า Row Level Security', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 40, false, 3),
      (v_c202, 'EP.4 สั่ง Desktop Agent โค้ดหน้าบ้านและระบบสมาชิกอัตโนมัติ', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 55, false, 4),
      (v_c202, 'EP.5 Deploy ขึ้น Vercel และเชื่อม Custom Domain ใช้งานจริง', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 25, false, 5);

    DELETE FROM public.course_attachments WHERE course_id = v_c202;
    INSERT INTO public.course_attachments (course_id, title, file_url, file_type, file_size, order_number)
    VALUES
      (v_c202, 'Starter Kit Web App Template (Next.js + Supabase).zip', 'https://example.com/vibe-starter.zip', 'zip', '8.9 MB', 1);
  END IF;
END $$;
