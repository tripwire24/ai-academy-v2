-- Profiles: users can read own, admins can read all
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins full access to profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Courses: published courses visible to all authenticated users
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses visible to authenticated"
  ON public.courses FOR SELECT
  USING (is_published = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins/trainers manage courses"
  ON public.courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role IN ('admin', 'trainer')
    )
  );

-- Progress: users own their progress
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their progress"
  ON public.progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Trainers can view all progress"
  ON public.progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role IN ('admin', 'trainer')
    )
  );

-- Notes: users own their notes, shared notes visible to trainers
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their notes"
  ON public.notes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Trainers see shared notes"
  ON public.notes FOR SELECT
  USING (
    visibility IN ('trainer', 'cohort') AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_role IN ('admin', 'trainer')
    )
  );
