const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

connectDB();


app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', reviewRoutes);
app.use('/api/search', searchRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
