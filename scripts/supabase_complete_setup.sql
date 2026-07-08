-- ============================================================
-- GFTeam SaaS — Complete Schema Setup & Migration
-- Paste this script into your Supabase SQL Editor (Project → SQL Editor → New Query)
-- and click "Run". It is safe to run even if you already have data!
-- ============================================================

-- 1. Migrate TENANTS columns if they don't exist
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'starter';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Update existing tenant to have a slug
UPDATE tenants SET slug = 'gfteam-matriz' WHERE slug IS NULL AND name = 'GFTeam Matriz';
UPDATE tenants SET slug = 'gfteam-matriz' WHERE slug IS NULL; -- fallback

-- Make slug unique and not null for future inserts
ALTER TABLE tenants ALTER COLUMN slug SET NOT NULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tenants_slug_key'
  ) THEN
    ALTER TABLE tenants ADD CONSTRAINT tenants_slug_key UNIQUE (slug);
  END IF;
END $$;


-- 2. Migrate PROFILES columns if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{
  "finance": false,
  "students": false,
  "training": false,
  "plans": false,
  "admin": false
}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripes INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS training_time TEXT DEFAULT 'Recém-chegado';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_specs JSONB DEFAULT '{
  "hair": "Curto",
  "facialHair": "Nenhum",
  "giColor": "Branco",
  "isKids": false
}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_classes INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS training_hours INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medals INTEGER DEFAULT 0;

-- Ensure check constraint on role and status exist
DO $$
BEGIN
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('master', 'manager', 'instructor', 'student'));
  
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_status_check CHECK (status IN ('pending', 'active', 'inactive'));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;


-- 3. Create LEADS table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  turma TEXT,                          -- ex: 'Adulto', 'Kids', 'Muay Thai', 'Feminino'
  source TEXT DEFAULT 'landing_page',  -- landing_page | instagram | indicacao | whatsapp
  utm_source TEXT,                     -- ex: 'facebook', 'google', 'instagram'
  utm_campaign TEXT,                   -- nome da campanha de tráfego
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'contato', 'agendado', 'matriculado', 'perdido')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 4. Create EXPENSES table if it doesn't exist
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  description TEXT NOT NULL,          -- ex: 'Sabão', 'Café'
  amount DECIMAL(12,2) DEFAULT 0.00,
  category TEXT DEFAULT 'outros',      -- limpeza | expediente | aluguel | outros
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 5. Create SCHEDULES table if it doesn't exist
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  weekday TEXT NOT NULL,               -- 'Segunda-feira', 'Terça-feira', etc.
  time_start TEXT NOT NULL,            -- '18:00'
  time_end TEXT NOT NULL,              -- '19:30'
  class_name TEXT NOT NULL,            -- 'Jiu-Jitsu Adulto'
  instructor_name TEXT,
  mat_name TEXT DEFAULT 'Principal',
  class_type TEXT DEFAULT 'Gi',        -- Gi | No-Gi
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 6. Create LESSONS table if it doesn't exist
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  title TEXT NOT NULL,
  category TEXT,                       -- Guarda, Passagem, Finalização
  level TEXT,                          -- Iniciante, Intermediário, Avançado
  youtube_id TEXT,                     -- ex: 'dQw4w9WgXcQ'
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 7. Create TRAINING_PLANS table if it doesn't exist
CREATE TABLE IF NOT EXISTS training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  week_focus TEXT NOT NULL,            -- ex: 'Semana 12: Fundamentos de Guarda'
  active_date DATE DEFAULT current_date,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 8. Create NOTIFICATIONS table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  title TEXT NOT NULL,
  content TEXT,
  urgency TEXT DEFAULT 'low' CHECK (urgency IN ('low', 'high')),
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 9. Create PAYMENTS table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  payment_method TEXT, -- 'pix', 'cartao', 'dinheiro'
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 10. Create CHECKINS table if it doesn't exist
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending')),
  photo_url TEXT, -- Base64 selfie
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- HELPER FUNCTIONS & RLS POLICIES
-- ============================================================

-- Function: get current user's tenant_id
CREATE OR REPLACE FUNCTION get_my_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function: get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Function: Initialize System (Bootstrap Matriz & Master user)
CREATE OR REPLACE FUNCTION initialize_master_system(
  user_id UUID,
  user_full_name TEXT,
  matriz_name TEXT
) RETURNS VOID AS $$
DECLARE
  new_tenant_id UUID;
BEGIN
  -- Check if Matriz already exists, if not, create it
  IF NOT EXISTS (SELECT 1 FROM tenants WHERE slug = 'gfteam-matriz') THEN
    INSERT INTO tenants (id, name, slug, plan)
    VALUES ('00000000-0000-0000-0000-000000000001', matriz_name, 'gfteam-matriz', 'enterprise')
    RETURNING id INTO new_tenant_id;
  ELSE
    SELECT id INTO new_tenant_id FROM tenants WHERE slug = 'gfteam-matriz' LIMIT 1;
  END IF;

  -- Create or Update the MASTER profile
  INSERT INTO profiles (id, tenant_id, full_name, role, status)
  VALUES (user_id, new_tenant_id, user_full_name, 'master', 'active')
  ON CONFLICT (id) DO UPDATE SET 
    role = 'master',
    status = 'active',
    tenant_id = new_tenant_id,
    full_name = user_full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions for RPC
GRANT EXECUTE ON FUNCTION initialize_master_system TO anon, authenticated;


-- Enable Row Level Security on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;


-- 11. Re-create RLS Policies safely (using DO blocks to drop/recreate)
DO $$
BEGIN
  -- Tenants
  DROP POLICY IF EXISTS "master sees all tenants" ON tenants;
  CREATE POLICY "master sees all tenants" ON tenants FOR SELECT USING (get_my_role() = 'master');
  
  DROP POLICY IF EXISTS "manager sees own tenant" ON tenants;
  CREATE POLICY "manager sees own tenant" ON tenants FOR SELECT USING (id = get_my_tenant_id());

  -- Profiles
  DROP POLICY IF EXISTS "users see own tenant profiles" ON profiles;
  CREATE POLICY "users see own tenant profiles" ON profiles FOR SELECT USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id() OR id = auth.uid());
  
  DROP POLICY IF EXISTS "users update own profile" ON profiles;
  CREATE POLICY "users update own profile" ON profiles FOR ALL USING (id = auth.uid() OR get_my_role() = 'master' OR (get_my_role() = 'manager' AND tenant_id = get_my_tenant_id()));

  -- Leads
  DROP POLICY IF EXISTS "managers manage own leads" ON leads;
  CREATE POLICY "managers manage own leads" ON leads FOR ALL USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id());
  
  DROP POLICY IF EXISTS "anyone can insert leads" ON leads;
  CREATE POLICY "anyone can insert leads" ON leads FOR INSERT WITH CHECK (true); -- so public landing pages can submit leads

  -- Expenses
  DROP POLICY IF EXISTS "managers manage own expenses" ON expenses;
  CREATE POLICY "managers manage own expenses" ON expenses FOR ALL USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id());

  -- Schedules
  DROP POLICY IF EXISTS "managers manage own schedules" ON schedules;
  CREATE POLICY "managers manage own schedules" ON schedules FOR ALL USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id() OR (get_my_role() = 'student' AND tenant_id = get_my_tenant_id()));

  -- Lessons
  DROP POLICY IF EXISTS "masters manage lessons" ON lessons;
  CREATE POLICY "masters manage lessons" ON lessons FOR ALL USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id());
  
  DROP POLICY IF EXISTS "everyone sees lessons" ON lessons;
  CREATE POLICY "everyone sees lessons" ON lessons FOR SELECT USING (true);

  -- Training Plans
  DROP POLICY IF EXISTS "managers manage plans" ON training_plans;
  CREATE POLICY "managers manage plans" ON training_plans FOR ALL USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id() OR (get_my_role() = 'student' AND tenant_id = get_my_tenant_id()));

  -- Notifications
  DROP POLICY IF EXISTS "everyone sees notifications" ON notifications;
  CREATE POLICY "everyone sees notifications" ON notifications FOR SELECT USING (true);
  
  DROP POLICY IF EXISTS "masters manage notifications" ON notifications;
  CREATE POLICY "masters manage notifications" ON notifications FOR ALL USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id());

  -- Payments
  DROP POLICY IF EXISTS "managers manage own payments" ON payments;
  CREATE POLICY "managers manage own payments" ON payments FOR ALL USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id() OR (get_my_role() = 'student' AND student_id = auth.uid()));

  -- Checkins
  DROP POLICY IF EXISTS "managers manage own checkins" ON checkins;
  CREATE POLICY "managers manage own checkins" ON checkins FOR ALL USING (get_my_role() = 'master' OR tenant_id = get_my_tenant_id());
  
  DROP POLICY IF EXISTS "students insert checkins" ON checkins;
  CREATE POLICY "students insert checkins" ON checkins FOR INSERT WITH CHECK (student_id = auth.uid());

  DROP POLICY IF EXISTS "students read own checkins" ON checkins;
  CREATE POLICY "students read own checkins" ON checkins FOR SELECT USING (student_id = auth.uid());
END $$;

-- Force Schema Cache Reload
NOTIFY pgrst, 'reload schema';

