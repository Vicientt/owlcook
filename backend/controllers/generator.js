const generatorRouter = require('express').Router()
const prompt = require('../utils/prompt')
require('dotenv').config()

const OpenAI = require('openai')
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

generatorRouter.post('/', async (req, res) => {
    const {budget, portion, cookingTime, diet, cuisine} = req.body
    const request = prompt(budget, portion, cookingTime, diet, cuisine)
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{role: "user", content: request}]
    });

    const recipe = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(recipe)
})

module.exports = generatorRouter