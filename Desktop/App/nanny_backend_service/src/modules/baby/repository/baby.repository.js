const db = require("../../../config/database.config");

const mapBaby = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    parent_id: row.parent_id,
    name: row.name,
    dob: row.dob,
    gender: row.gender,
    image_url: row.image_url,
    any_period_disease: row.any_period_disease,
    note: row.note,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

class BabyRepository {
  async findById(id) {
    const { rows } = await db.query(`SELECT * FROM babies WHERE id = $1 LIMIT 1`, [id]);
    return mapBaby(rows[0] || null);
  }

  async findAllByParentId(parentId) {
    const { rows } = await db.query(
      `SELECT * FROM babies WHERE parent_id = $1 ORDER BY created_at ASC`,
      [parentId]
    );
    return rows.map(mapBaby);
  }

  async create(parentId, fields) {
    const { rows } = await db.query(
      `
        INSERT INTO babies (parent_id, name, dob, gender, image_url, any_period_disease, note)
        VALUES ($1, $2, $3, $4::baby_gender, $5, $6, $7)
        RETURNING *
      `,
      [
        parentId,
        fields.name,
        fields.dob ?? null,
        fields.gender ?? null,
        fields.image_url ?? null,
        fields.any_period_disease ?? null,
        fields.note ?? null
      ]
    );
    return mapBaby(rows[0]);
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
    if (patch.gender !== undefined) push("gender = $n::baby_gender", patch.gender);
    if (patch.image_url !== undefined) push("image_url = $n", patch.image_url);
    if (patch.any_period_disease !== undefined) push("any_period_disease = $n", patch.any_period_disease);
    if (patch.note !== undefined) push("note = $n", patch.note);

    if (assignments.length === 0) return this.findById(id);

    assignments.push("updated_at = NOW()");
    values.push(id);

    const { rows } = await db.query(
      `UPDATE babies SET ${assignments.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    return mapBaby(rows[0] || null);
  }

  async delete(id) {
    await db.query(`DELETE FROM babies WHERE id = $1`, [id]);
  }
}

module.exports = new BabyRepository();
