const db = require("../../../config/database.config");

const mapUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    mobile: row.mobile,
    role: row.role,
    is_verified: row.is_verified,
    is_active: row.is_active !== undefined ? row.is_active : true,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

class UserRepository {
  async create({ mobile, role = "user", is_verified = false, is_active = true }) {
    const { rows } = await db.query(
      `
        INSERT INTO users (mobile, role, is_verified, is_active)
        VALUES ($1, $2::user_role, $3, $4)
        RETURNING id, mobile, role, is_verified, is_active, created_at, updated_at
      `,
      [mobile, role, is_verified, is_active]
    );
    return mapUser(rows[0]);
  }

  async findById(id) {
    const { rows } = await db.query(
      `
        SELECT id, mobile, role, is_verified, is_active, created_at, updated_at
        FROM users
        WHERE id = $1
      `,
      [id]
    );
    return mapUser(rows[0] || null);
  }

  async findActiveById(id) {
    const { rows } = await db.query(
      `
        SELECT id, mobile, role, is_verified, is_active, created_at, updated_at
        FROM users
        WHERE id = $1 AND is_active = TRUE
      `,
      [id]
    );
    return mapUser(rows[0] || null);
  }

  async findByMobileAnyStatus(mobile) {
    const { rows } = await db.query(
      `
        SELECT id, mobile, role, is_verified, is_active, created_at, updated_at
        FROM users
        WHERE mobile = $1
      `,
      [mobile]
    );
    return mapUser(rows[0] || null);
  }

  async findAll({ page, limit, isActive, mobileSearch }) {
    const offset = (page - 1) * limit;
    const conditions = ["1=1"];
    const values = [];
    let i = 1;

    if (isActive === true || isActive === false) {
      conditions.push(`is_active = $${i}`);
      values.push(isActive);
      i += 1;
    }

    if (mobileSearch) {
      conditions.push(`mobile ILIKE $${i}`);
      values.push(`%${mobileSearch}%`);
      i += 1;
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM users WHERE ${whereClause}`,
      values
    );
    const total = countResult.rows[0].total;

    values.push(limit, offset);
    const limitIdx = i;
    const offsetIdx = i + 1;

    const { rows } = await db.query(
      `
        SELECT id, mobile, role, is_verified, is_active, created_at, updated_at
        FROM users
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${limitIdx} OFFSET $${offsetIdx}
      `,
      values
    );

    return {
      items: rows.map(mapUser),
      total,
      page,
      limit
    };
  }

  async update(id, patch) {
    const assignments = [];
    const values = [];

    const push = (fragment, value) => {
      values.push(value);
      assignments.push(fragment.replace(/\$n/g, `$${values.length}`));
    };

    if (patch.mobile !== undefined) push("mobile = $n", patch.mobile);
    if (patch.role !== undefined) push("role = $n::user_role", patch.role);
    if (patch.is_verified !== undefined) push("is_verified = $n", patch.is_verified);
    if (patch.is_active !== undefined) push("is_active = $n", patch.is_active);

    if (assignments.length === 0) {
      return this.findById(id);
    }

    assignments.push("updated_at = NOW()");
    values.push(id);

    const { rows } = await db.query(
      `
        UPDATE users
        SET ${assignments.join(", ")}
        WHERE id = $${values.length}
        RETURNING id, mobile, role, is_verified, is_active, created_at, updated_at
      `,
      values
    );
    return mapUser(rows[0] || null);
  }

  async softDeleteAndRemoveNannies(id) {
    const client = await db.getClient();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM nannies WHERE user_id = $1", [id]);
      const { rows } = await client.query(
        `
          UPDATE users
          SET is_active = FALSE, updated_at = NOW()
          WHERE id = $1 AND is_active = TRUE
          RETURNING id, mobile, role, is_verified, is_active, created_at, updated_at
        `,
        [id]
      );
      await client.query("COMMIT");
      return mapUser(rows[0] || null);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new UserRepository();
