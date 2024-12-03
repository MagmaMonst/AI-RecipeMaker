const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Route for fetching a recipe from TheMealDB
app.post('/generate-recipe', async (req, res) => {
    const { dishName } = req.body;

    if (!dishName) {
        return res.status(400).json({ error: 'Dish name is required' });
    }

    try {
        // Fetch recipe data from TheMealDB API
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${dishName}`);

        if (!response.data.meals) {
            return res.status(404).json({ error: 'No recipes found for that dish.' });
        }

        const recipe = response.data.meals[0]; // Get the first result
        res.json({
            name: recipe.strMeal,
            category: recipe.strCategory,
            area: recipe.strArea,
            instructions: recipe.strInstructions,
            image: recipe.strMealThumb,
            ingredients: Object.keys(recipe)
                .filter(key => key.startsWith('strIngredient') && recipe[key])
                .map((key, index) => ({
                    ingredient: recipe[key],
                    measure: recipe[`strMeasure${index + 1}`] || '',
                }))
        });
    } catch (error) {
        console.error('Error fetching recipe:', error.message);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
