import express from 'express';
import { PrismaClient } from '@prisma/client';

import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes.js';
import menuRoutes from './src/routes/menuRoutes.js';
import orderRoutes from './src/routes/ordersRoutes.js';
import tableRoutes from './src/routes/tableRoutes.js';  
import invoiceRoutes from './src/routes/invoiceRoutes.js';
import salesRoutes from './src/routes/salesRoutes.js';
import categoryRoutes from './src/routes/categoryRoutrs.js';



import dotenv from 'dotenv';
dotenv.config();



const app = express();
const prisma = new PrismaClient();
export default prisma;

app.use(bodyParser.json());

// Routes will go here
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/category', categoryRoutes);





const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
