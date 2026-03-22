const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    time: String,
    cost: String,
    servings: String,
    difficulty: String,
    ingredients: [
        {
            name: String,
            amount: String
        }
    ],
    steps: [],
    nutritions: {
        calories: String,
        protein: String,
        carbs: String,
        fat: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

foodSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Food', foodSchema)