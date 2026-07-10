require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const jobsRouter = require("./routes/jobs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use("/jobs", jobsRouter);

app.get("/", (req, res) => {
  res.send("Trackora API is running 🚀");
});
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
