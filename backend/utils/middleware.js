const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.session || !request.session.userId) {
    return response.status(401).json({ error: 'Not authenticated' })
  }
  try {
    const user = await User.findById(request.session.userId)
    if (!user) {
      return response.status(401).json({ error: 'User not found' })
    }
    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  next(error)
}

module.exports = { requestLogger, userExtractor, errorHandler }
