const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./db/dbconfig');
const TaskRoutes = require('./routes/tasks.routes');
const authRoutes = require('./routes/user.routes')
connectDB();
const PORT = process.env.PORT || 5000; // Default Port 5000

//enable cors 
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// auth routes
app.use('/api/v1/user', authRoutes)

// task routes
app.use('/api/v1/tasks', TaskRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})

