const express = require('express')
const cors = require('cors')
const foodRouter = require('./controllers/food')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const generatorRouter = require('./controllers/generator')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')

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
app.use(express.static('dist'))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
//app.use(middleware.userExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/food', foodRouter)
app.use('/api/generator', generatorRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
