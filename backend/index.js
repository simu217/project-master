const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const memberRoutes = require("./routes/member");
const hiveRoutes = require("./routes/hive");
const previewRoutes = require("./routes/preview");
const cors = require("cors");
const app = express();

const PORT = 5008;
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/atlantis";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/hive", hiveRoutes);
app.use("/api/preview", previewRoutes);

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
