require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const jobsRouter = require("./routes/jobs");
const usersRouter = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);

app.get("/", (req, res) => {
  res.send("Trackora API is running 🚀");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
