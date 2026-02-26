-- ═══════════════════════════════════════
-- USERS & PROFILES
-- ═══════════════════════════════════════

-- auth.users is managed by Supabase Auth

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  avatar_url    TEXT,
  company       TEXT,
  role          TEXT,                              -- job title
  bio           TEXT,
  user_role     TEXT NOT NULL DEFAULT 'learner'    -- 'learner' | 'trainer' | 'admin'
    CHECK (user_role IN ('learner', 'trainer', 'admin')),
  timezone      TEXT DEFAULT 'Pacific/Auckland',
  theme_preference TEXT DEFAULT 'system'
    CHECK (theme_preference IN ('light', 'dark', 'system')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════
-- COURSES
-- ═══════════════════════════════════════

CREATE TABLE public.courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,              -- URL-safe identifier
  title         TEXT NOT NULL,
  subtitle      TEXT,
  description   TEXT,                              -- rich text / MD
  cover_image   TEXT,                              -- storage URL
  category      TEXT,                              -- 'executive', 'practitioner', 'vertical'
  difficulty    TEXT DEFAULT 'beginner'
    CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours NUMERIC(5,1),
  is_published  BOOLEAN DEFAULT false,
  is_sequential BOOLEAN DEFAULT true,              -- enforce module order
  created_by    UUID REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════
-- MODULES (grouping unit within a course)
-- ═══════════════════════════════════════

CREATE TABLE public.modules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  slug          TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  estimated_minutes INT,
  is_published  BOOLEAN DEFAULT false,
  prerequisites UUID[],                            -- array of module IDs required first
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- ═══════════════════════════════════════
-- LESSONS (individual content unit)
-- ═══════════════════════════════════════

CREATE TABLE public.lessons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id     UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  slug          TEXT NOT NULL,
  title         TEXT NOT NULL,
  content_md    TEXT,                              -- raw Markdown content
  content_html  TEXT,                              -- pre-rendered HTML (optional cache)
  lesson_type   TEXT DEFAULT 'content'
    CHECK (lesson_type IN ('content', 'video', 'exercise', 'quiz', 'discussion')),
  video_url     TEXT,                              -- YouTube/Vimeo URL
  video_duration_seconds INT,
  sort_order    INT NOT NULL DEFAULT 0,
  estimated_minutes INT,
  is_published  BOOLEAN DEFAULT false,
  speaker_notes TEXT,                              -- facilitator-only notes
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module_id, slug)
);

-- ═══════════════════════════════════════
-- HANDOUTS & RESOURCES
-- ═══════════════════════════════════════

CREATE TABLE public.handouts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  module_id     UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  course_id     UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  file_url      TEXT NOT NULL,                     -- Supabase Storage URL
  file_type     TEXT NOT NULL                      -- 'pdf', 'md', 'xlsx', 'docx', 'link'
    CHECK (file_type IN ('pdf', 'md', 'xlsx', 'docx', 'link', 'other')),
  file_size_bytes BIGINT,
  download_count INT DEFAULT 0,
  is_published  BOOLEAN DEFAULT true,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════
-- ENROLLMENTS
-- ═══════════════════════════════════════

CREATE TABLE public.enrollments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at   TIMESTAMPTZ DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  status        TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'paused', 'expired')),
  UNIQUE(user_id, course_id)
);

-- ═══════════════════════════════════════
-- PROGRESS TRACKING
-- ═══════════════════════════════════════

CREATE TABLE public.progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id     UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  time_spent_seconds INT DEFAULT 0,
  last_position TEXT,                              -- bookmark (scroll position, video timestamp)
  UNIQUE(user_id, lesson_id)
);

-- ═══════════════════════════════════════
-- USER NOTES
-- ═══════════════════════════════════════

CREATE TABLE public.notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id     UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  module_id     UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id     UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,                     -- Markdown note content
  is_shared     BOOLEAN DEFAULT false,             -- shared with trainer
  visibility    TEXT DEFAULT 'private'
    CHECK (visibility IN ('private', 'trainer', 'cohort')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════
-- CERTIFICATES
-- ═══════════════════════════════════════

CREATE TABLE public.certificates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at     TIMESTAMPTZ DEFAULT now(),
  pdf_url       TEXT,
  UNIQUE(user_id, course_id)
);

-- ═══════════════════════════════════════
-- AI CHAT HISTORY (per user, per context)
-- ═══════════════════════════════════════

CREATE TABLE public.ai_conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id     UUID REFERENCES public.lessons(id),
  module_id     UUID REFERENCES public.modules(id),
  course_id     UUID REFERENCES public.courses(id),
  messages      JSONB NOT NULL DEFAULT '[]',       -- [{role, content, timestamp}]
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════

CREATE INDEX idx_modules_course ON public.modules(course_id, sort_order);
CREATE INDEX idx_lessons_module ON public.lessons(module_id, sort_order);
CREATE INDEX idx_progress_user ON public.progress(user_id);
CREATE INDEX idx_progress_lesson ON public.progress(lesson_id);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_notes_user ON public.notes(user_id);
CREATE INDEX idx_notes_lesson ON public.notes(lesson_id);
CREATE INDEX idx_handouts_lesson ON public.handouts(lesson_id);
CREATE INDEX idx_handouts_module ON public.handouts(module_id);
