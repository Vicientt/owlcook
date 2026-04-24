const generatorRouter = require('express').Router()
const prompt = require('../utils/prompt')
require('dotenv').config()

const OpenAI = require('openai')

let openai = null
const getOpenAI = () => {
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }
    return openai
}

generatorRouter.post('/', async (req, res) => {
    const {budget, portion, cookingTime, diet, cuisine} = req.body
    const request = prompt(budget, portion, cookingTime, diet, cuisine)
    const completion = await getOpenAI().chat.completions.create({
        model: "gpt-4",
        messages: [{role: "user", content: request}]
    });

    const recipe = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(recipe)
})

module.exports = generatorRouter