const db = require("../../../config/database.config");

const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    user_id: row.user_id,
    first_name: row.first_name,
    middle_name: row.middle_name,
    last_name: row.last_name,
    dob: row.dob,
    image: row.image,
    mobile_number: row.mobile_number,
    email_id: row.email_id,
    gender: row.gender,
    address: row.address,
    permanent_address: row.permanent_address,
    emergency_contact: row.emergency_contact,
    certificates: Array.isArray(row.certificates) ? row.certificates : [],
    experience: row.experience_years !== null && row.experience_years !== undefined
      ? Number(row.experience_years)
      : null,
    aadhar_number: row.aadhar_number,
    pan_card: row.pan_card,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

class NannyRepository {
  async create(payload) {
    const { rows } = await db.query(
      `
        INSERT INTO nannies (
          user_id, first_name, middle_name, last_name, dob, image, mobile_number, email_id,
          gender, address, permanent_address, emergency_contact, certificates,
          experience_years, aadhar_number, pan_card, is_active
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9::nanny_gender, $10, $11, $12, $13::jsonb,
          $14, $15, $16, COALESCE($17, TRUE)
        )
        RETURNING *
      `,
      [
        payload.user_id,
        payload.first_name,
        payload.middle_name ?? null,
        payload.last_name,
        payload.dob,
        payload.image ?? null,
        payload.mobile_number,
        payload.email_id,
        payload.gender,
        payload.address ?? null,
        payload.permanent_address ?? null,
        payload.emergency_contact ?? null,
        JSON.stringify(payload.certificates || []),
        payload.experience_years,
        payload.aadhar_number,
        payload.pan_card,
        payload.is_active
      ]
    );
    return mapRow(rows[0]);
  }

  async findByUserId(userId) {
    const { rows } = await db.query(`SELECT * FROM nannies WHERE user_id = $1 LIMIT 1`, [userId]);
    return mapRow(rows[0] || null);
  }

  async findById(id, { includeInactive = true } = {}) {
    const params = [id];
    let where = "id = $1";
    if (!includeInactive) {
      where += " AND is_active = TRUE";
    }
    const { rows } = await db.query(`SELECT * FROM nannies WHERE ${where} LIMIT 1`, params);
    return mapRow(rows[0] || null);
  }

  async findAll({ page, limit, isActive, gender, experienceMin, experienceMax, mobileSearch }) {
    const offset = (page - 1) * limit;
    const conditions = ["1=1"];
    const values = [];
    let i = 1;

    if (isActive === true || isActive === false) {
      conditions.push(`is_active = $${i}`);
      values.push(isActive);
      i += 1;
    }

    if (gender) {
      conditions.push(`gender = $${i}::nanny_gender`);
      values.push(gender);
      i += 1;
    }

    if (experienceMin !== null && experienceMin !== undefined) {
      conditions.push(`experience_years >= $${i}`);
      values.push(experienceMin);
      i += 1;
    }

    if (experienceMax !== null && experienceMax !== undefined) {
      conditions.push(`experience_years <= $${i}`);
      values.push(experienceMax);
      i += 1;
    }

    if (mobileSearch) {
      conditions.push(`mobile_number ILIKE $${i}`);
      values.push(`%${mobileSearch}%`);
      i += 1;
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM nannies WHERE ${whereClause}`,
      values
    );
    const total = countResult.rows[0].total;

    values.push(limit, offset);
    const limitIdx = i;
    const offsetIdx = i + 1;

    const { rows } = await db.query(
      `
        SELECT * FROM nannies
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${limitIdx} OFFSET $${offsetIdx}
      `,
      values
    );

    return {
      items: rows.map(mapRow),
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

    if (patch.user_id !== undefined) push("user_id = $n", patch.user_id);
    if (patch.first_name !== undefined) push("first_name = $n", patch.first_name);
    if (patch.middle_name !== undefined) push("middle_name = $n", patch.middle_name);
    if (patch.last_name !== undefined) push("last_name = $n", patch.last_name);
    if (patch.dob !== undefined) push("dob = $n", patch.dob);
    if (patch.image !== undefined) push("image = $n", patch.image);
    if (patch.mobile_number !== undefined) push("mobile_number = $n", patch.mobile_number);
    if (patch.email_id !== undefined) push("email_id = $n", patch.email_id);
    if (patch.gender !== undefined) push("gender = $n::nanny_gender", patch.gender);
    if (patch.address !== undefined) push("address = $n", patch.address);
    if (patch.permanent_address !== undefined) {
      push("permanent_address = $n", patch.permanent_address);
    }
    if (patch.emergency_contact !== undefined) {
      push("emergency_contact = $n", patch.emergency_contact);
    }
    if (patch.certificates !== undefined) {
      push("certificates = $n::jsonb", JSON.stringify(patch.certificates));
    }
    if (patch.experience_years !== undefined) {
      push("experience_years = $n", patch.experience_years);
    }
    if (patch.aadhar_number !== undefined) push("aadhar_number = $n", patch.aadhar_number);
    if (patch.pan_card !== undefined) push("pan_card = $n", patch.pan_card);
    if (patch.is_active !== undefined) push("is_active = $n", patch.is_active);

    if (assignments.length === 0) {
      return this.findById(id);
    }

    assignments.push("updated_at = NOW()");
    values.push(id);

    const { rows } = await db.query(
      `
        UPDATE nannies
        SET ${assignments.join(", ")}
        WHERE id = $${values.length}
        RETURNING *
      `,
      values
    );
    return mapRow(rows[0] || null);
  }

  async softDelete(id) {
    const { rows } = await db.query(
      `
        UPDATE nannies
        SET is_active = FALSE, updated_at = NOW()
        WHERE id = $1 AND is_active = TRUE
        RETURNING *
      `,
      [id]
    );
    return mapRow(rows[0] || null);
  }
}

module.exports = new NannyRepository();
