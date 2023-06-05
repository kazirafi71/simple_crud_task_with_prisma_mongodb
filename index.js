const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

//TODO: middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TODO: Routes

app.use("/api", userRoutes);
app.use("/api", authRoutes);

//TODO: Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running");
});
