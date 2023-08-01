const express = require("express");
const mongoose = require("mongoose");
const restaurantsRouter = require("./routes/restaurants");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/find-my-restaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/api/restaurant", restaurantsRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
