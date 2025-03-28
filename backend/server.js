require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');

// Kết nối MongoDB
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Sử dụng cổng từ biến môi trường PORT, mặc định là 5000 nếu không có
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));