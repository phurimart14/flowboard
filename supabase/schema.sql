-- ============================================
-- FlowBoard — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. boards
CREATE TABLE IF NOT EXISTS public.boards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  owner_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now()
);

-- 3. board_members
CREATE TABLE IF NOT EXISTS public.board_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id    uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at   timestamptz DEFAULT now(),
  UNIQUE(board_id, user_id)
);

-- Auto-add owner as member when board is created
CREATE OR REPLACE FUNCTION public.handle_new_board()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.board_members (board_id, user_id)
  VALUES (new.id, new.owner_id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_board_created ON public.boards;
CREATE TRIGGER on_board_created
  AFTER INSERT ON public.boards
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_board();

-- 4. cards
CREATE TABLE IF NOT EXISTS public.cards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id    uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  column_id   text NOT NULL CHECK (column_id IN ('backlog','todo','in_progress','review','done')),
  title       text NOT NULL,
  description text,
  due_date    date,
  priority    text CHECK (priority IN ('high','mid','low')),
  position    integer NOT NULL DEFAULT 0,
  created_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_card_updated ON public.cards;
CREATE TRIGGER on_card_updated
  BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- profiles: เห็นได้เฉพาะตัวเอง และ member ร่วม board
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id
    OR id IN (
      SELECT bm.user_id FROM public.board_members bm
      WHERE bm.board_id IN (
        SELECT board_id FROM public.board_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- boards: เห็นเฉพาะ board ที่เป็น member
CREATE POLICY "boards_select" ON public.boards
  FOR SELECT USING (
    id IN (SELECT board_id FROM public.board_members WHERE user_id = auth.uid())
  );

CREATE POLICY "boards_insert" ON public.boards
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "boards_update" ON public.boards
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "boards_delete" ON public.boards
  FOR DELETE USING (auth.uid() = owner_id);

-- board_members: เห็นเฉพาะแถวของตัวเอง (ไม่มี self-reference → ไม่ recursive)
-- user อื่นใน board เดียวกันดูผ่าน boards table แทน
CREATE POLICY "board_members_select" ON public.board_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "board_members_insert" ON public.board_members
  FOR INSERT WITH CHECK (
    board_id IN (SELECT id FROM public.boards WHERE owner_id = auth.uid())
  );

CREATE POLICY "board_members_delete" ON public.board_members
  FOR DELETE USING (
    board_id IN (SELECT id FROM public.boards WHERE owner_id = auth.uid())
  );

-- cards: เห็นเฉพาะ card ใน board ที่เป็น member
CREATE POLICY "cards_select" ON public.cards
  FOR SELECT USING (
    board_id IN (SELECT board_id FROM public.board_members WHERE user_id = auth.uid())
  );

CREATE POLICY "cards_insert" ON public.cards
  FOR INSERT WITH CHECK (
    board_id IN (SELECT board_id FROM public.board_members WHERE user_id = auth.uid())
  );

CREATE POLICY "cards_update" ON public.cards
  FOR UPDATE USING (
    board_id IN (SELECT board_id FROM public.board_members WHERE user_id = auth.uid())
  );

CREATE POLICY "cards_delete" ON public.cards
  FOR DELETE USING (
    board_id IN (SELECT board_id FROM public.board_members WHERE user_id = auth.uid())
  );

-- ============================================
-- Realtime
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.cards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.board_members;
