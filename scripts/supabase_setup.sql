-- ============================================================
-- GFTeam SaaS — Schema Setup
-- Run this in Supabase SQL Editor (Project → SQL Editor → New Query)
-- ============================================================

-- 1. TENANTS (academias)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,       -- ex: "frazao-academia"
  plan TEXT DEFAULT 'starter',     -- starter | pro | enterprise
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PROFILES (usuários do sistema)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  full_name TEXT,
  role TEXT CHECK (role IN ('master', 'manager', 'instructor', 'student')) DEFAULT 'student',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. LEADS (CRM)
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
  status TEXT DEFAULT 'novo'
    CHECK (status IN ('novo', 'contato', 'agendado', 'matriculado', 'perdido')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. EXPENSES (Financeiro)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  description TEXT NOT NULL,          -- ex: 'Sabão', 'Café'
  amount DECIMAL(12,2) DEFAULT 0.00,
  category TEXT DEFAULT 'outros',      -- limpeza | expediente | aluguel | outros
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's tenant_id
CREATE OR REPLACE FUNCTION get_my_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Tenants: only master sees all, managers see their own
CREATE POLICY "master sees all tenants" ON tenants
  FOR SELECT USING (get_my_role() = 'master');

CREATE POLICY "manager sees own tenant" ON tenants
  FOR SELECT USING (id = get_my_tenant_id());

-- Profiles: users see only their own tenant's profiles
CREATE POLICY "users see own tenant profiles" ON profiles
  FOR SELECT USING (
    get_my_role() = 'master' OR tenant_id = get_my_tenant_id()
  );

CREATE POLICY "users update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

    get_my_role() = 'master' OR tenant_id = get_my_tenant_id()
  );

-- Expenses: managers managed their own expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "managers manage own expenses" ON expenses
  FOR ALL USING (
    get_my_role() = 'master' OR tenant_id = get_my_tenant_id()
  );

-- ============================================================
-- SEED DATA — GFTeam Matriz tenant + Julio Master
-- (Run AFTER creating Julio's account via Supabase Auth → Users)
-- ============================================================

-- Step 1: Create GFTeam Matriz tenant
INSERT INTO tenants (id, name, slug, plan) VALUES
  ('00000000-0000-0000-0000-000000000001', 'GFTeam Matriz', 'gfteam-matriz', 'enterprise')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- FRAZÃO TENANT SETUP
-- (Run after creating Frazão account via Auth → Users)
-- ============================================================

-- Step 2: Create Frazão's tenant
INSERT INTO tenants (name, slug, plan) VALUES
  ('GFTeam Frazão', 'frazao-academia', 'pro')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AFTER CREATING USERS IN AUTH:
-- Replace the UUIDs below with the real user IDs from Auth → Users
-- ============================================================

-- Julio Master profile (replace 'JULIO-USER-ID' with real UUID)
-- INSERT INTO profiles (id, tenant_id, full_name, role) VALUES
--   ('JULIO-USER-ID', '00000000-0000-0000-0000-000000000001', 'Julio Mestre', 'master');

-- Frazão Manager profile (replace 'FRAZAO-USER-ID' with real UUID)
-- INSERT INTO profiles (id, tenant_id, full_name, role) VALUES
--   ('FRAZAO-USER-ID', (SELECT id FROM tenants WHERE slug = 'frazao-academia'), 'Frazão', 'manager');
