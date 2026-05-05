const pool = require('../db')

const findById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id])
  return rows[0] || null
}

const findByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])
  return rows[0] || null
}

const findAll = async () => {
  const [rows] = await pool.execute('SELECT id, email, name, created_at FROM users')
  return rows
}

const create = async ({ email, name, passwordHash }) => {
  const [result] = await pool.execute(
    'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
    [email, name, passwordHash]
  )
  return { id: result.insertId, email, name }
}

const updatePassword = async (id, passwordHash) => {
  await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id])
}

const updateName = async (id, name) => {
  await pool.execute('UPDATE users SET name = ? WHERE id = ?', [name, id])
}

const deleteByEmail = async (email) => {
  await pool.execute('DELETE FROM users WHERE email = ?', [email])
}

module.exports = { findById, findByEmail, findAll, create, updatePassword, updateName, deleteByEmail }
