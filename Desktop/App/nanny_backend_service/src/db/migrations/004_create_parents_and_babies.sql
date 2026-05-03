CREATE TYPE parent_gender AS ENUM ('male', 'female', 'other');
CREATE TYPE baby_gender   AS ENUM ('male', 'female', 'other');

CREATE TABLE IF NOT EXISTS parents (
  id                       BIGSERIAL PRIMARY KEY,
  user_id                  BIGINT NOT NULL,
  name                     VARCHAR(150) NOT NULL,
  dob                      DATE,
  address                  TEXT,
  permanent_address        TEXT,
  emergency_contact_number VARCHAR(15),
  email                    VARCHAR(255),
  gender                   parent_gender,
  mother_name              VARCHAR(150),
  father_name              VARCHAR(150),
  mother_occupation        VARCHAR(150),
  father_occupation        VARCHAR(150),
  image_url                TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_parents_user   FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT uq_parents_user_id UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_parents_user_id ON parents (user_id);

CREATE TABLE IF NOT EXISTS babies (
  id                 BIGSERIAL PRIMARY KEY,
  parent_id          BIGINT NOT NULL,
  name               VARCHAR(150) NOT NULL,
  dob                DATE,
  gender             baby_gender,
  image_url          TEXT,
  any_period_disease TEXT,
  note               TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_babies_parent FOREIGN KEY (parent_id) REFERENCES parents (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_babies_parent_id ON babies (parent_id);
