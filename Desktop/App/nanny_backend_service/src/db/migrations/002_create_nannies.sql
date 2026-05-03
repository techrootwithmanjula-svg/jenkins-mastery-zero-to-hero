CREATE TYPE nanny_gender AS ENUM ('male', 'female', 'other');

CREATE TABLE IF NOT EXISTS nannies (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  image TEXT,
  mobile_number VARCHAR(15) NOT NULL,
  email_id VARCHAR(255) NOT NULL,
  gender nanny_gender NOT NULL,
  address TEXT,
  permanent_address TEXT,
  emergency_contact VARCHAR(50),
  certificates JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience_years NUMERIC(6, 2) NOT NULL,
  aadhar_number VARCHAR(12) NOT NULL,
  pan_card VARCHAR(10) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_nannies_mobile_number UNIQUE (mobile_number),
  CONSTRAINT uq_nannies_email_id UNIQUE (email_id),
  CONSTRAINT uq_nannies_aadhar_number UNIQUE (aadhar_number),
  CONSTRAINT uq_nannies_pan_card UNIQUE (pan_card)
);

CREATE INDEX IF NOT EXISTS idx_nannies_is_active ON nannies (is_active);
CREATE INDEX IF NOT EXISTS idx_nannies_gender ON nannies (gender);
CREATE INDEX IF NOT EXISTS idx_nannies_experience_years ON nannies (experience_years);
CREATE INDEX IF NOT EXISTS idx_nannies_created_at ON nannies (created_at DESC);
