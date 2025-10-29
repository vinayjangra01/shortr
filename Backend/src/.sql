CREATE TABLE urls (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  original_url TEXT NOT NULL,
  short_url TEXT NOT NULL,
  custom_url TEXT,
  user_id UUID,
  title TEXT,
  qr_code TEXT
);
