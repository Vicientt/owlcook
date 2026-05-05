const pool = require('../db')

const parseFood = (row) => {
  if (!row) return null
  const { calories, protein, carbs, fat, ...rest } = row
  return {
    ...rest,
    ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients) : (row.ingredients || []),
    steps: typeof row.steps === 'string' ? JSON.parse(row.steps) : (row.steps || []),
    nutritions: { calories, protein, carbs, fat },
  }
}

const findByUser = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT f.*, u.email AS user_email, u.name AS user_name
     FROM foods f JOIN users u ON f.user_id = u.id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [userId]
  )
  return rows.map(parseFood)
}

const findById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM foods WHERE id = ?', [id])
  return parseFood(rows[0] || null)
}

const create = async ({ name, description, time, cost, servings, difficulty, ingredients, steps, nutritions, userId }) => {
  const [result] = await pool.execute(
    `INSERT INTO foods
       (name, description, time, cost, servings, difficulty, ingredients, steps,
        calories, protein, carbs, fat, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, description, time, cost, servings, difficulty,
      JSON.stringify(ingredients || []),
      JSON.stringify(steps || []),
      nutritions?.calories || null,
      nutritions?.protein || null,
      nutritions?.carbs   || null,
      nutritions?.fat     || null,
      userId,
    ]
  )
  return findById(result.insertId)
}

const deleteById = async (id) => {
  await pool.execute('DELETE FROM foods WHERE id = ?', [id])
}

module.exports = { findByUser, findById, create, deleteById }
