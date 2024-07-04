const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/transactionRoutes');

const app = express();

// Body parser middleware
app.use(express.json());

// Define MongoDB connection URI
const databaseUser = 'TeamProcessing';
const databasePassword = 'team123';
const databaseName = 'KIET-MCA-1stYear';
const dbLink = `mongodb+srv://${databaseUser}:${databasePassword}@cluster0.rw9cta9.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(dbLink, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('---------Database Connected ------------');

  // Use router for '/api' endpoints
  app.use('/api', router);

  // Start the server
  app.listen(5000, () => {
    console.log('---------App Started ------------');
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit the process on connection error
});
