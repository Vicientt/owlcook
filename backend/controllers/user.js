const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

usersRouter.post('/', async (req, res) => {
  const { email, name, password } = req.body
  if (!name || name.length < 3 || !password || password.length < 3) {
    return res.status(400).json({ error: 'Email or password do not meet minimum length requirement!' })
  }

  const existing = await User.findByEmail(email)
  if (existing) {
    return res.status(400).json({ error: 'Email existed, please choose another email!' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const savedUser = await User.create({ email, name, passwordHash })
  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

usersRouter.put('/', userExtractor, async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(400).json({ error: 'Invalid userId or token expired' })
  }

  if (req.body.oldPassword) {
    const checkPassword = await bcrypt.compare(req.body.oldPassword, user.password_hash)
    if (!checkPassword) {
      return res.status(400).json({ error: 'Old password is not correct!' })
    }
    const passwordHash = await bcrypt.hash(req.body.newPassword, 10)
    await User.updatePassword(user.id, passwordHash)
    return res.status(200).json({ message: 'Password updated successfully!' })
  }

  if (req.body.name) {
    await User.updateName(user.id, req.body.name)
    return res.status(200).json({ message: 'Update name successfully!' })
  }
})

module.exports = usersRouter
