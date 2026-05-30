const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Defensive fallback: check if MONGO_URI is missing or contains placeholder '<db_password>'
let dbUri = process.env.MONGO_URI;
if (!dbUri || dbUri.includes("<db_password>")) {
  console.warn("⚠️ Warning: MongoDB Atlas URI is unconfigured or contains placeholder '<db_password>'.");
  console.log("👉 Falling back to local MongoDB at mongodb://127.0.0.1:27017/expense_tracker");
  dbUri = "mongodb://127.0.0.1:27017/expense_tracker";
}

mongoose.connect(dbUri)
    .then(() => console.log(`🚀 MongoDB Connected! Connected to: ${dbUri.substring(0, 30)}...`))
    .catch(err => {
      console.error("❌ MongoDB Connection Error:", err.message);
      console.log("Tips: Ensure MongoDB service is running (systemctl start mongod) or provide a valid MONGO_URI in server/.env");
    });

app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});