const express = require('express')
const cors = require('cors')
const session = require('express-session')
const path = require('path')
const foodRouter = require('./controllers/food')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const generatorRouter = require('./controllers/generator')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const User = require('./models/user')

const app = express()

mongoose.connect(config.MONGODB_URI, { family: 4 })
.then(() => {
    logger.info("Connected to MongoDB successfully")
    logger.info(`Run in Path: ${config.MONGODB_URI}`)
})
.catch(error => {
    logger.error(error.message)
})

// Serve static files from dist (frontend build)
app.use(express.static(path.join(__dirname, 'dist')))

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true
}))
app.use(express.json())

app.use(session({
    secret: process.env.SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use(middleware.requestLogger)

// GET /api/me - check current logged-in user via session
app.get('/api/me', async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' })
    }
    try {
        const user = await User.findById(req.session.userId)
        if (!user) {
            req.session.destroy(() => {})
            return res.status(401).json({ error: 'User not found' })
        }
        res.json({ email: user.email, name: user.name, id: user._id })
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

// POST /api/logout - destroy server-side session
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Could not log out' })
        res.clearCookie('connect.sid')
        res.json({ message: 'Logged out successfully' })
    })
})

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/food', foodRouter)
app.use('/api/generator', generatorRouter)
app.use(middleware.errorHandler)

// Catch-all: serve React app for any non-API route (must be last)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

module.exports = app
