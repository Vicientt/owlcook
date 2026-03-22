const foodRouter = require('express').Router()
const Food = require('../models/food')
const User = require('../models/user')
const logger = require('../utils/logger')
require('dotenv').config()
const {userExtractor} = require('../utils/middleware')

foodRouter.get('/', userExtractor, async (request, response, next) => {
    const user = request.user
    if(!user){
        return response.status(400).json({error: 'userId missing or not valid - controllers/food'})
    }
    const foods = await Food.find({user: user.id}).populate('user', {email: 1, name: 1})
    response.json(foods)
})

foodRouter.get('/:id', userExtractor, async (request, response, next) => {
    const user = request.user
    if(!user){
        return response.status(400).json({error: 'userId missing or not valid - controllers/food'})
    }

    const target_recipe = await Food.findById(request.params.id)
    if(!target_recipe) {
        return response.status(400).json({error: 'id request is not in the database'})
    }
    else if (target_recipe.user.toString() !== user._id.toString()) {
        return response.status(400).json({error: 'This id is not belong to this user!'})
    }
    else if (target_recipe.user.toString() === user._id.toString()) {
        return response.status(200).json(target_recipe)
    }
})

foodRouter.post('/', userExtractor, async (request, response, next) => {
    const user = request.user
    if(!user){
        return response.status(400).json({error: 'userId missing or not valid - controllers/food'})
    }

    const body = request.body
    const newRecipe = new Food({
        name: body.name,
        description: body.description,
        time: body.time,
        cost: body.cost,
        servings: body.servings,
        difficulty: body.difficulty,
        ingredients: body.ingredients,
        steps: body.steps,
        nutritions: body.nutritions,
        user: user.id
    })

    const result = await newRecipe.save()
    user.foods = user.foods.concat(result._id)
    await user.save()
    response.status(201).json(result)
})

foodRouter.delete('/:id', userExtractor, async (request, response, next) => {
    const user = request.user
    if(!user){
        return response.status(400).json({error: 'userId missing or not valid - controllers/food'})
    }

    const target_recipe = await Food.findById(request.params.id)
    if(!target_recipe) {
        return response.status(400).json({error: 'id request is not in the database'})
    }
    else if (target_recipe.user.toString() !== user._id.toString()) {
        return response.status(400).json({error: 'This id is not belong to this user!'})
    }
    else if (target_recipe.user.toString() === user._id.toString()) {
        await Food.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    }
})

module.exports = foodRouter