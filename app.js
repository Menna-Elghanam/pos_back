import express from 'express';
import { PrismaClient } from '@prisma/client';

import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes.js';


const app = express();
const prisma = new PrismaClient();
export default prisma;

app.use(bodyParser.json());

// Routes will go here
app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
