const mongoose = require('mongoose')
const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')

app.listen(config.PORT, '0.0.0.0', () => {
  logger.info(`Server running on http://0.0.0.0:${config.PORT}`)
})