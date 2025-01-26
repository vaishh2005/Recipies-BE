const Recipe = require('../model/Recipe');
const User = require('../model/User');

// Get all recipes with optional filters
const getRecipes = async (req, res) => {
  
  
  const { search, cuisine, difficulty } = req.query;

  try {
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (cuisine) query.cuisine = cuisine;
    if (difficulty) query.difficulty = difficulty;

    const recipes = await Recipe.find(query).populate('createdBy', 'name email');
    if(recipes.length>0){
      res.json(recipes);
    }else{
      res.status(200).json({message:"no any recipe found for this user"});
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: error.message });
  }
};

// Add a new recipe
const addRecipe = async (req, res) => {
  const { title, image, ingredients, steps, cuisine, difficulty } = req.body;
  try {
    const recipe = new Recipe({
      title,
      image,
      ingredients,
      steps,
      cuisine,
      difficulty,
      createdBy: req.user.id,
    });

    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  
  
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name email');

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single recipe by ID
const getRecipeByName = async (req, res) => {
  try {
    const name = req.body.userName;
    const userId = await User.findOne({ name: name });

    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recipe = await Recipe.find({ createdBy: userId._id }).populate('createdBy', 'name email');
    console.log(recipe);
    
    if (recipe.length > 0) {
      res.json(recipe);
    } else {
      res.status(200).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update a recipe
// Update a recipe
const updateRecipe = async (req, res) => {
  const { title, image, ingredients, steps, cuisine, difficulty } = req.body;

  try {
    // Fetch the recipe by ID
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user is authorized to update the recipe
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    // Update only provided fields
    if (title !== undefined) recipe.title = title;
    if (image !== undefined) recipe.image = image;
    if (ingredients !== undefined) recipe.ingredients = ingredients;
    if (steps !== undefined) recipe.steps = steps;
    if (cuisine !== undefined) recipe.cuisine = cuisine;
    if (difficulty !== undefined) recipe.difficulty = difficulty;

    // Save the updated recipe
    const updatedRecipe = await recipe.save();

    // Send response
    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      recipe: updatedRecipe,
    });
  } catch (error) {
    // Catch errors (e.g., invalid ID format) and respond
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update recipe',
      error: error.message,
    });
  }
};




// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    // Check if the recipe exists and the user is authorized
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    // Delete the recipe
    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recipe removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getRecipes,
  addRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipeByName
};

