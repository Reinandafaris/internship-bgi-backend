import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express Backend!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
