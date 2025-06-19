import express from 'express';
import dotenv from 'dotenv';
// import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import apiLimiter from './middleware/rateLimit.js';

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


// Routes
app.use('/api/auth', apiLimiter , authRoutes );
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
