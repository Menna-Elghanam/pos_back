import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

// Create a new category
router.post('/create', createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get a specific category by ID
router.get('/:id', getCategoryById);

// Update a category
router.patch('/:id', updateCategory);

// Delete a category
router.delete('/:id', deleteCategory);

export default router;
