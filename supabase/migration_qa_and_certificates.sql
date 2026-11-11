-- ==============================================================================
-- aifullfill.com : Classroom Q&A System & Opt-in Certificate of Completion
-- ==============================================================================

-- 1. ตารางคำถามใต้บทเรียน (Course Questions)
CREATE TABLE IF NOT EXISTS public.course_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.course_episodes(id) ON DELETE SET NULL,
  episode_title TEXT,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_questions_course ON public.course_questions(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_questions_user ON public.course_questions(user_id);

-- 2. ตารางคำตอบใต้คำถาม (Course Answers)
CREATE TABLE IF NOT EXISTS public.course_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.course_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_instructor_reply BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_answers_question ON public.course_answers(question_id, created_at ASC);

-- 3. ตารางใบประกาศนียบัตรสำหรับผู้ที่เรียนจบ 100% และเลือกรับใบเซอร์ (Course Certificates)
CREATE TABLE IF NOT EXISTS public.course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  instructor_name TEXT NOT NULL DEFAULT 'อาจารย์อั๋น (AIEbookAcademy)',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_certificates_user ON public.course_certificates(user_id, issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_certificates_code ON public.course_certificates(certificate_code);

-- 4. เปิดใช้งาน RLS และกำหนด Policies
ALTER TABLE public.course_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.course_questions, public.course_answers, public.course_certificates TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_questions, public.course_answers, public.course_certificates TO authenticated;

-- Policies สำหรับ course_questions
CREATE POLICY "Questions are viewable by everyone"
  ON public.course_questions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON public.course_questions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Owners and admins can update questions"
  ON public.course_questions
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin())
  WITH CHECK ((SELECT auth.uid()) = user_id OR public.is_admin());

CREATE POLICY "Owners and admins can delete questions"
  ON public.course_questions
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

-- Policies สำหรับ course_answers
CREATE POLICY "Answers are viewable by everyone"
  ON public.course_answers
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create answers"
  ON public.course_answers
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Owners and admins can delete answers"
  ON public.course_answers
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

-- Policies สำหรับ course_certificates
CREATE POLICY "Certificates are publicly verifiable by everyone"
  ON public.course_certificates
  FOR SELECT
  USING (true);

CREATE POLICY "Users can issue own certificates"
  ON public.course_certificates
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update recipient name on own certificate"
  ON public.course_certificates
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin())
  WITH CHECK ((SELECT auth.uid()) = user_id OR public.is_admin());
