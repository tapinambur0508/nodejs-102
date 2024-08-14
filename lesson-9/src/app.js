import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;
