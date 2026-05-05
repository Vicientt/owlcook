const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findByEmail(email)
  if (!user) {
    return res.status(401).json({
      error: 'This email have not been registered! Please sign up first!'
    })
  }

  const passwordCorrect = await bcrypt.compare(password, user.password_hash)
  if (!passwordCorrect) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  req.session.userId = user.id
  res.status(200).json({ email: user.email, name: user.name, id: user.id })
})

module.exports = loginRouter
