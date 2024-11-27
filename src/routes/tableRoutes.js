import express from 'express';
import { createTable, getAllTables, getTableById, updateTable, deleteTable } from '../controllers/tableController.js';

const router = express.Router();

// Route to create a new table
router.post('/', createTable);

// Route to get all tables
router.get('/', getAllTables);

// Route to get a specific table by ID
router.get('/:tableId', getTableById);

// Route to update a table
router.put('/:tableId', updateTable);

// Route to delete a table
router.delete('/:tableId', deleteTable);

export default router;
