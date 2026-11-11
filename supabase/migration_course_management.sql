-- Migration: Course Management System Enhancements
-- Support Categories, Rich Content HTML, Prompts JSONB, and Video Type

ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'AI & Vibe Coding';

ALTER TABLE public.course_episodes 
ADD COLUMN IF NOT EXISTS content_html TEXT,
ADD COLUMN IF NOT EXISTS prompts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS video_type TEXT DEFAULT 'auto';

CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
