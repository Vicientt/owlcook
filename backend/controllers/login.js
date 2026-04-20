const bcrypt = require('bcrypt')
require('dotenv').config()
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).json({
            error: 'This email have not been registered! Please sign up first!'
        })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
        return res.status(401).json({
            error: 'Invalid username or password'
        })
    }

    req.session.userId = user._id

    res.status(200).json({ email: user.email, name: user.name, id: user._id })
})

module.exports = loginRouter