const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})
    if (!user) {
        return res.status(401).json({
            error: 'This email have not been registered! Please sign up first!'
        })
    }
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if(!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password'
        })
    }

    const userForToken = {
        email: email,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: '1h'})

    res.status(200).send({token, email: user.email, name: user.name})

})

module.exports = loginRouter