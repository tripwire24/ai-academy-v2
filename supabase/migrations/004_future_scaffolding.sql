-- 004_future_scaffolding.sql

-- Quizzes
CREATE TABLE public.quizzes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID REFERENCES public.lessons(id),
  title       TEXT NOT NULL,
  questions   JSONB NOT NULL DEFAULT '[]',
  pass_score  INT DEFAULT 70,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.quiz_responses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id     UUID REFERENCES public.quizzes(id),
  user_id     UUID REFERENCES public.profiles(id),
  answers     JSONB NOT NULL,
  score       INT,
  passed      BOOLEAN,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Cohorts
CREATE TABLE public.cohorts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  course_id   UUID REFERENCES public.courses(id),
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.cohort_members (
  cohort_id   UUID REFERENCES public.cohorts(id),
  user_id     UUID REFERENCES public.profiles(id),
  PRIMARY KEY (cohort_id, user_id)
);

-- Discussions
CREATE TABLE public.discussions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID REFERENCES public.lessons(id),
  user_id     UUID REFERENCES public.profiles(id),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.discussion_replies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.discussions(id),
  user_id       UUID REFERENCES public.profiles(id),
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id),
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  read        BOOLEAN DEFAULT false,
  data        JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions (Stripe future)
CREATE TABLE public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles(id),
  stripe_sub_id   TEXT,
  plan            TEXT,
  status          TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);
