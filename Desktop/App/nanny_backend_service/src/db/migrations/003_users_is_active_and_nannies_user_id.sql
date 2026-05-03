-- Soft-delete flag for users (default active for existing rows)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN users.is_active IS 'False when admin deactivates the user; OTP login only matches active users.';

-- Link each nanny profile to exactly one user account
ALTER TABLE nannies ADD COLUMN IF NOT EXISTS user_id BIGINT;

ALTER TABLE nannies DROP CONSTRAINT IF EXISTS fk_nannies_user_id;
ALTER TABLE nannies
  ADD CONSTRAINT fk_nannies_user_id
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_nannies_user_id ON nannies (user_id);

-- At most one nanny row per user (ignore NULL user_id for legacy rows until backfilled)
CREATE UNIQUE INDEX IF NOT EXISTS uq_nannies_user_id ON nannies (user_id) WHERE user_id IS NOT NULL;

-- After backfilling user_id for all nannies, enforce NOT NULL:
-- ALTER TABLE nannies ALTER COLUMN user_id SET NOT NULL;
