import express from 'express';
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';

const router = express.Router();

// Create a new menu item
router.post('/', createMenuItem);

// Get all menu items
router.get('/', getAllMenuItems);

// Get a specific menu item by ID
router.get('/:id', getMenuItemById);

// Update a menu item by ID
router.put('/:id', updateMenuItem);

// Delete a menu item by ID
router.delete('/:id', deleteMenuItem);

export default router;
