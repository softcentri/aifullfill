-- ==============================================================================
-- aifullfill.com : Seed Data สำหรับตาราง Courses & Episodes
-- นำไปรันใน SQL Editor ของ Supabase เพื่อเพิ่มคอร์สตัวอย่าง
-- ==============================================================================

-- 1. เพิ่มข้อมูลคอร์สตัวอย่าง
INSERT INTO public.courses (title, slug, description, instructor, required_tier, content_type, is_published, order_number)
VALUES
  (
    'AI Game Developer: Vibe Coding สร้างเกม 2D/MMO ด้วย AI ใครก็ทำได้',
    'ai-game-developer',
    'เจาะลึกการใช้ Claude และ AI Agent เขียนโค้ดเกมตั้งแต่เริ่มต้นจนถึงระบบ Multi-player MMO พร้อมซอร์สโค้ดครบชุด',
    'AI Academy Team',
    'premium',
    'course',
    true,
    1
  ),
  (
    'Claude 3.5 & 3.7 Sonnet Masterclass: รัน Agentic Coding ระดับเซียน',
    'claude-masterclass',
    'สั่ง Claude Code และสร้าง MCP Server เช็คสิทธิ์และเชื่อมฐานข้อมูลในระดับโปรดักชัน',
    'AI Academy Team',
    'premium',
    'course',
    true,
    2
  ),
  (
    'n8n Automation Pro Workflows: ดึงข้อมูลอัตโนมัติ ยิงแชท LINE และ CRM',
    'n8n-automation',
    'สร้าง Workflow อัตโนมัติช่วยประหยัดเวลาการทำงาน ลดงานซ้ำซาก 90% ด้วยระบบ No-Code + AI',
    'AI Academy Team',
    'premium',
    'course',
    true,
    3
  ),
  (
    'สร้างช่อง YouTube & TikTok ด้วย AI วิดีโอสั้นปังใน 10 นาที',
    'ai-content-video',
    'สูตรลับการใช้ AI คิด Hook, เขียนสคริปต์, ตัดต่อ และสร้างเสียงบรรยายไทยที่สมจริง',
    'AI Academy Team',
    'standard',
    'course',
    true,
    4
  ),
  (
    'Midjourney Mastery: วาดภาพประกอบ ปกหนังสือ โลโก้ และสินค้าให้ขายได้',
    'midjourney-mastery',
    'รวมเทคนิคการเขียน Prompt คุมสไตล์ ตัวละครเดิม และการสร้างภาพความละเอียดสูง 4K',
    'AI Academy Team',
    'standard',
    'course',
    true,
    5
  ),
  (
    'สร้างบอท LINE OA ปิดการขายอัตโนมัติด้วย ChatGPT API',
    'line-chatbot-ai',
    'ประกอบร่างแชทบอทตอบคำถามลูกค้า รับออเดอร์ และสรุปยอดขายลง Google Sheets แบบจับมือทำ',
    'AI Academy Team',
    'standard',
    'course',
    true,
    6
  )
ON CONFLICT (slug) DO NOTHING;

-- 2. เพิ่มตอนเรียนตัวอย่างสำหรับคอร์ส AI Game Developer
DO $$
DECLARE
  v_course_id UUID;
BEGIN
  SELECT id INTO v_course_id FROM public.courses WHERE slug = 'ai-game-developer' LIMIT 1;

  IF v_course_id IS NOT NULL THEN
    INSERT INTO public.course_episodes (course_id, title, video_url, duration_minutes, is_free_preview, order_number)
    VALUES
      (v_course_id, 'EP.1 AI Game Developer ทฤษฎีและภาพรวม', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 30, true, 1),
      (v_course_id, 'EP.2 การติดตั้ง Environment & Claude Code', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 7, false, 2),
      (v_course_id, 'EP.3 Workshop 1 ออกแบบเกมแพลตฟอร์ม 2D', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 60, false, 3),
      (v_course_id, 'EP.4 Workshop 2 ออกแบบกราฟิก Pixel Art ด้วย AI', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 15, false, 4),
      (v_course_id, 'EP.5 Workshop 3 ระบบ Clicker / Idle Game', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 37, false, 5),
      (v_course_id, 'EP.6 Workshop 4 เชื่อมระบบ MMO Multi-player', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 145, false, 6),
      (v_course_id, 'EP.7 สรุปงานและแนวทางการ Deploy สู่เว็บ', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 9, false, 7);

    -- เพิ่มไฟล์แนบตัวอย่าง
    INSERT INTO public.course_attachments (course_id, title, file_url, file_type, file_size, order_number)
    VALUES
      (v_course_id, 'ซอร์สโค้ดเกม AI Game Developer (Complete).zip', 'https://example.com/source-code.zip', 'zip', '24.5 MB', 1);
  END IF;
END $$;
