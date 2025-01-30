import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes";
import userRoutes from "./src/routes/user.routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";
app.listen(PORT, () =>
  console.log(`Server running in ${ENV || "development"} mode on port ${PORT}`)
);
