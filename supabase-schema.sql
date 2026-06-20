-- ========================================
-- 礼服馆小红书获客问卷系统 - Supabase 数据库初始化脚本
-- 使用方法：在 Supabase Dashboard > SQL Editor 中粘贴并执行
-- ========================================

-- ============ 创建预约表 ============
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL,
  city TEXT,
  identity TEXT,
  contact_name TEXT,
  contact_info TEXT,
  main_business TEXT,
  price_range TEXT,
  main_problem TEXT,
  account_status TEXT,
  ad_status TEXT,
  comm_method TEXT,
  comm_time TEXT,
  quick_question TEXT,
  source TEXT DEFAULT 'direct',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- ============ 创建诊断表 ============
CREATE TABLE IF NOT EXISTS diagnostics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL,
  city TEXT,
  store_age TEXT,
  store_area TEXT,
  categories TEXT,
  business_model TEXT,
  price_range TEXT,
  business_goal TEXT,
  advantages TEXT,
  popular_products TEXT,
  customer_concerns TEXT,
  competitors TEXT,
  xhs_consults_30d TEXT,
  xhs_visits_30d TEXT,
  xhs_deals_30d TEXT,
  photo_count TEXT,
  photo_auth TEXT,
  weekly_materials TEXT,
  on_camera_person TEXT,
  content_menpower TEXT,
  account_count TEXT,
  account_names TEXT,
  account_owners TEXT,
  post_frequency TEXT,
  account_issues TEXT,
  avg_exposure TEXT,
  ad_history TEXT,
  ad_account TEXT,
  ad_spend_90d TEXT,
  ad_results TEXT,
  ad_no_data_reason TEXT,
  ad_budget TEXT,
  ad_goal TEXT,
  consult_handler TEXT,
  response_time TEXT,
  project_contact TEXT,
  monthly_shoot TEXT,
  cooperation_period TEXT,
  agree_diagnosis TEXT,
  agree_case TEXT,
  source TEXT DEFAULT 'direct',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- ============ 启用行级安全 (RLS) ============
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;

-- ============ RLS 策略 ============
-- 预约表：公开可写入，仅登录用户可读取和修改
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_select_bookings" ON bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_update_bookings" ON bookings FOR UPDATE TO authenticated USING (true);

-- 诊断表：公开可写入，仅登录用户可读取和修改
CREATE POLICY "public_insert_diagnostics" ON diagnostics FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_select_diagnostics" ON diagnostics FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_update_diagnostics" ON diagnostics FOR UPDATE TO authenticated USING (true);

-- ============ 创建索引（提升查询性能） ============
CREATE INDEX IF NOT EXISTS idx_bookings_submitted_at ON bookings(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_diagnostics_submitted_at ON diagnostics(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnostics_status ON diagnostics(status);
CREATE INDEX IF NOT EXISTS idx_diagnostics_response_time ON diagnostics(response_time);
