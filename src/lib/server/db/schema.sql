-- Pikastro CMS Database Schema
-- PostgreSQL database for inline content editing

-- Admin users table (for Magda)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content table (stores all editable text by translation key)
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,  -- e.g., "home.hero.heading1"
  value TEXT NOT NULL,
  locale VARCHAR(10) DEFAULT 'pl',   -- language code
  category VARCHAR(100),              -- e.g., "home", "portfolio", "services"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content history (audit log of all changes)
CREATE TABLE IF NOT EXISTS content_history (
  id SERIAL PRIMARY KEY,
  content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
  content_key VARCHAR(255),
  old_value TEXT,
  new_value TEXT,
  changed_by INTEGER REFERENCES admin_users(id),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_key ON content(key);
CREATE INDEX IF NOT EXISTS idx_content_locale ON content(locale);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
CREATE INDEX IF NOT EXISTS idx_history_content_id ON content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_history_changed_at ON content_history(changed_at);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
