const express = require('express');
const {
  getRecipes,
  addRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipeByName
} = require('../controller/recipeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get all recipes (Public)
router.get('/', getRecipes);

// Route to add a new recipe (Protected)
router.post('/adrecipe', protect, addRecipe);

// Route to get a specific recipe by ID (Public)
router.get('/:id', getRecipeById);

// Route to update a specific recipe by ID (Protected)
router.put('/:id', protect, updateRecipe);

// Route to delete a specific recipe by ID (Protected)
router.delete('/delete/:id', protect, deleteRecipe);

// Route to get a recipe by username (Protected)
router.post('/user', protect, getRecipeByName);

module.exports = router;
