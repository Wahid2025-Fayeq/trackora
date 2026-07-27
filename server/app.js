require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const jobsRouter = require("./routes/jobs");
const usersRouter = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");
const authRouter = require("./routes/auth");
const aiRoutes = require("./routes/ai");

const app = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: clientUrl,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Trackora API is running 🚀");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
