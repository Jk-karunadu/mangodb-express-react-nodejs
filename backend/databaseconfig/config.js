const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

// Log the mongoDb variable to check if it's being read correctly
console.log("MongoDB URI:", process.env.mongoDb);

const mongoUri = process.env.mongoDb;

if (!mongoUri) {
  console.error("MongoDB URI is not defined in the .env file!");
  process.exit(1); // Exit the application
}

// Connect to MongoDB
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));
