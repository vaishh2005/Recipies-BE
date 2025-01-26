const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    image: {
      type: String, // URL to the image
      required: [true, 'Image URL is required'],
    },
    ingredients: {
      type: [String], // Array of ingredient strings
      required: [true, 'Ingredients are required'],
    },
    steps: {
      type: [String], // Array of step descriptions
      required: [true, 'Preparation steps are required'],
    },
    cuisine: {
      type: String, // Example: "Indian", "Italian", "Chinese"
      required: [true, 'Cuisine type is required'],
    },
    difficulty: {
      type: String, // Example: "Easy", "Medium", "Hard"
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
