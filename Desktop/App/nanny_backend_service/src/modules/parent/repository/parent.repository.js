const db = require("../../../config/database.config");

const mapParent = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    dob: row.dob,
    address: row.address,
    permanent_address: row.permanent_address,
    emergency_contact_number: row.emergency_contact_number,
    email: row.email,
    gender: row.gender,
    mother_name: row.mother_name,
    father_name: row.father_name,
    mother_occupation: row.mother_occupation,
    father_occupation: row.father_occupation,
    image_url: row.image_url,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

class ParentRepository {
  async findByUserId(userId) {
    const { rows } = await db.query(
      `SELECT * FROM parents WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    return mapParent(rows[0] || null);
  }

  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM parents WHERE id = $1 LIMIT 1`,
      [id]
    );
    return mapParent(rows[0] || null);
  }

  async create(userId, fields) {
    const { rows } = await db.query(
      `
        INSERT INTO parents (
          user_id, name, dob, address, permanent_address,
          emergency_contact_number, email, gender,
          mother_name, father_name, mother_occupation, father_occupation, image_url
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8::parent_gender,$9,$10,$11,$12,$13)
        RETURNING *
      `,
      [
        userId,
        fields.name,
        fields.dob ?? null,
        fields.address ?? null,
        fields.permanent_address ?? null,
        fields.emergency_contact_number ?? null,
        fields.email ?? null,
        fields.gender ?? null,
        fields.mother_name ?? null,
        fields.father_name ?? null,
        fields.mother_occupation ?? null,
        fields.father_occupation ?? null,
        fields.image_url ?? null
      ]
    );
    return mapParent(rows[0]);
  }

  async update(id, patch) {
    const assignments = [];
    const values = [];

    const push = (fragment, value) => {
      values.push(value);
      assignments.push(fragment.replace(/\$n/g, `$${values.length}`));
    };

    if (patch.name !== undefined) push("name = $n", patch.name);
    if (patch.dob !== undefined) push("dob = $n", patch.dob);
    if (patch.address !== undefined) push("address = $n", patch.address);
    if (patch.permanent_address !== undefined) push("permanent_address = $n", patch.permanent_address);
    if (patch.emergency_contact_number !== undefined) {
      push("emergency_contact_number = $n", patch.emergency_contact_number);
    }
    if (patch.email !== undefined) push("email = $n", patch.email);
    if (patch.gender !== undefined) push("gender = $n::parent_gender", patch.gender);
    if (patch.mother_name !== undefined) push("mother_name = $n", patch.mother_name);
    if (patch.father_name !== undefined) push("father_name = $n", patch.father_name);
    if (patch.mother_occupation !== undefined) push("mother_occupation = $n", patch.mother_occupation);
    if (patch.father_occupation !== undefined) push("father_occupation = $n", patch.father_occupation);
    if (patch.image_url !== undefined) push("image_url = $n", patch.image_url);

    if (assignments.length === 0) return this.findById(id);

    assignments.push("updated_at = NOW()");
    values.push(id);

    const { rows } = await db.query(
      `UPDATE parents SET ${assignments.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    return mapParent(rows[0] || null);
  }
}

module.exports = new ParentRepository();
