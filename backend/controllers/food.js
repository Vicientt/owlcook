const foodRouter = require('express').Router()
const Food = require('../models/food')
const { userExtractor } = require('../utils/middleware')

foodRouter.get('/', userExtractor, async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid - controllers/food' })
  }
  const foods = await Food.findByUser(user.id)
  res.json(foods)
})

foodRouter.get('/:id', userExtractor, async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid - controllers/food' })
  }

  const recipe = await Food.findById(req.params.id)
  if (!recipe) {
    return res.status(400).json({ error: 'id request is not in the database' })
  }
  if (recipe.user_id !== user.id) {
    return res.status(400).json({ error: 'This id is not belong to this user!' })
  }
  return res.status(200).json(recipe)
})

foodRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid - controllers/food' })
  }

  const body = req.body
  const result = await Food.create({
    name: body.name,
    description: body.description,
    time: body.time,
    cost: body.cost,
    servings: body.servings,
    difficulty: body.difficulty,
    ingredients: body.ingredients,
    steps: body.steps,
    nutritions: body.nutritions,
    userId: user.id,
  })
  res.status(201).json(result)
})

foodRouter.put('/:id', userExtractor, async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid - controllers/food' })
  }

  const recipe = await Food.findById(req.params.id)
  if (!recipe) {
    return res.status(400).json({ error: 'id request is not in the database' })
  }
  if (recipe.user_id !== user.id) {
    return res.status(400).json({ error: 'This id is not belong to this user!' })
  }

  const updated = await Food.update(req.params.id, req.body)
  return res.status(200).json(updated)
})

foodRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid - controllers/food' })
  }

  const recipe = await Food.findById(req.params.id)
  if (!recipe) {
    return res.status(400).json({ error: 'id request is not in the database' })
  }
  if (recipe.user_id !== user.id) {
    return res.status(400).json({ error: 'This id is not belong to this user!' })
  }
  await Food.deleteById(req.params.id)
  return res.status(204).end()
})

module.exports = foodRouter
