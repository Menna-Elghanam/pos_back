import express from 'express';
import { getTotalSales, getSalesByTable, getSalesByDay } from '../controllers/salesController.js';

const router = express.Router();

router.post('/total', getTotalSales);
router.get('/by-table', getSalesByTable);
router.post('/by-day', getSalesByDay);

export default router;
