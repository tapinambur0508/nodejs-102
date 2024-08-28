import path from 'node:path';

import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';

import { auth } from './middlewares/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.use('/avatars', express.static(path.resolve('src', 'public/avatars')));

app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/students', auth, studentRoutes);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;
