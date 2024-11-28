import express from 'express';
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
} from '../controllers/invoiceController.js';

const router = express.Router();

router.post('/create', createInvoice);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.patch('/:id/status', updateInvoiceStatus);

export default router;
