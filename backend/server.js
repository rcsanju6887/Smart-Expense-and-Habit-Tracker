const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SmartExpense Backend is running!' });
});

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/habits',   require('./routes/habits'));
app.use('/api/profile',  require('./routes/profile'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => {
    console.log('MongoDB connected!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log('MongoDB error, starting without DB...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });