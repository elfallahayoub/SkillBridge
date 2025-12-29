const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect MongoDB
connectDB();

app.use(cors());

app.use(express.json());


app.use("/api/users", require("./routes/userRoutes"));




app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
module.exports=app;