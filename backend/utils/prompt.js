const prompt = (budget, portion, cookingTime, diet, cuisine) => {
    const request = `
    You are a recipe generator.

    Based on the following inputs:
    - Budget: ${budget}
    - Servings: ${portion}
    - Cooking Time: ${cookingTime}
    - Diet: ${diet}
    - Cuisine: ${cuisine}

    Generate exactly ONE recipe that fits all the constraints.

    STRICT RULES:
    - Return ONLY a valid JSON string.
    - DO NOT include explanations, comments, or extra text.
    - DO NOT add any text before or after the JSON.
    - The response MUST match the exact structure below.
    - All values must be strings.
    - Keep the format identical.

    JSON FORMAT:
    {
    "name": "",
    "description": "",
    "time": "",
    "cost": "" - No need unit here (In USD),
    "servings": "" - Number of people,
    "difficulty": "" - Easy, Medium, Hard,
    "ingredients": [
        {
        "name": "",
        "amount": ""
        }
    ],
    "steps": [
        ""
    ] - each item in the array just string describe action, do not have add header like Steps 1: or something similar,
    "nutritions": {
        "calories": "",
        "protein": "",
        "carbs": "",
        "fat": ""
    }
    }

    If you include anything outside the JSON, the answer is incorrect.
    `
    return request
}

module.exports = prompt