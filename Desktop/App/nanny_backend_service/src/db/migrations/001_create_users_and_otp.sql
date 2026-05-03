CREATE TYPE user_role AS ENUM ('user', 'nanny', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_mobile ON users (mobile);

CREATE TABLE IF NOT EXISTS otp (
  id BIGSERIAL PRIMARY KEY,
  mobile VARCHAR(15) NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  attempts INTEGER NOT NULL DEFAULT 0,
  resend_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_mobile ON otp (mobile);
CREATE INDEX IF NOT EXISTS idx_otp_mobile_created_at ON otp (mobile, created_at DESC);
