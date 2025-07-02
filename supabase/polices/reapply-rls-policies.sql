-- 🧑‍💼 managers
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers can view themselves" ON managers;
DROP POLICY IF EXISTS "Authenticated users can insert manager" ON managers;

CREATE POLICY "Managers can view themselves"
  ON managers
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert manager"
  ON managers
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 👥 clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Manager can view their own clients" ON clients;
DROP POLICY IF EXISTS "Manager can insert clients" ON clients;
DROP POLICY IF EXISTS "Manager can update their clients" ON clients;

CREATE POLICY "Manager can view their own clients"
  ON clients
  FOR SELECT
  USING (manager_id = auth.uid());

CREATE POLICY "Manager can insert clients"
  ON clients
  FOR INSERT
  WITH CHECK (manager_id = auth.uid());

CREATE POLICY "Manager can update their clients"
  ON clients
  FOR UPDATE
  USING (manager_id = auth.uid());

-- ⚙️ client_settings
ALTER TABLE client_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Manager can view their clients' settings" ON client_settings;
DROP POLICY IF EXISTS "Manager can update their clients' settings" ON client_settings;

CREATE POLICY "Manager can view their clients' settings"
  ON client_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_settings.client_id
      AND clients.manager_id = auth.uid()
    )
  );

CREATE POLICY "Manager can update their clients' settings"
  ON client_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_settings.client_id
      AND clients.manager_id = auth.uid()
    )
  );

-- 🔐 login_tokens
ALTER TABLE login_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Manager can view their login tokens" ON login_tokens;
DROP POLICY IF EXISTS "Manager can create login token" ON login_tokens;

CREATE POLICY "Manager can view their login tokens"
  ON login_tokens
  FOR SELECT
  USING (manager_id = auth.uid());

CREATE POLICY "Manager can create login token"
  ON login_tokens
  FOR INSERT
  WITH CHECK (manager_id = auth.uid());

-- 🧩 manager_settings
ALTER TABLE manager_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Manager can view their settings" ON manager_settings;
DROP POLICY IF EXISTS "Manager can insert their settings" ON manager_settings;
DROP POLICY IF EXISTS "Manager can update their settings" ON manager_settings;

CREATE POLICY "Manager can view their settings"
  ON manager_settings
  FOR SELECT
  USING (manager_id = auth.uid());

CREATE POLICY "Manager can insert their settings"
  ON manager_settings
  FOR INSERT
  WITH CHECK (manager_id = auth.uid());

CREATE POLICY "Manager can update their settings"
  ON manager_settings
  FOR UPDATE
  USING (manager_id = auth.uid());

-- 📊 ad_accounts
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON ad_accounts;
CREATE POLICY "Allow all" ON ad_accounts FOR ALL USING (true) WITH CHECK (true);

-- 📣 campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON campaigns;
CREATE POLICY "Allow all" ON campaigns FOR ALL USING (true) WITH CHECK (true);

-- 🧪 ad_sets
ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON ad_sets;
CREATE POLICY "Allow all" ON ad_sets FOR ALL USING (true) WITH CHECK (true);

-- 🧱 ads
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON ads;
CREATE POLICY "Allow all" ON ads FOR ALL USING (true) WITH CHECK (true);

-- 📈 campaign_insights
ALTER TABLE campaign_insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON campaign_insights;
CREATE POLICY "Allow all" ON campaign_insights FOR ALL USING (true) WITH CHECK (true);

-- 🔍 ad_set_insights
ALTER TABLE ad_set_insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON ad_set_insights;
CREATE POLICY "Allow all" ON ad_set_insights FOR ALL USING (true) WITH CHECK (true);

-- 🎯 ad_insights
ALTER TABLE ad_insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON ad_insights;
CREATE POLICY "Allow all" ON ad_insights FOR ALL USING (true) WITH CHECK (true);

-- 🧾 facebook_tokens
ALTER TABLE facebook_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON facebook_tokens;
CREATE POLICY "Allow all" ON facebook_tokens FOR ALL USING (true) WITH CHECK (true);
