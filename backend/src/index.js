const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect MongoDB
connectDB();

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.json());
  
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
module.exports=app;