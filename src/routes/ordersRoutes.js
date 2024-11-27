// import express from 'express';
// import { createOrder, getAllOrders, getOrderById } from '../controllers/ordersController.js';

// const router = express.Router();

// // Route to create a new order
// router.post('/create', createOrder);

// // Route to get all orders
// router.get('/', getAllOrders);

// // Route to get a specific order by ID
// router.get('/:orderId', getOrderById);

// export default router;


import express from 'express';
import { createOrder, getAllOrders, getOrderById } from '../controllers/ordersController.js';

const router = express.Router();

// Route to create a new order
router.post('/create', createOrder);

// Route to get all orders
router.get('/', getAllOrders);

// Route to get a specific order by ID
router.get('/:orderId', getOrderById);

export default router;
