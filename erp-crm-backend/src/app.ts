import express from "express";
import cors from "cors";
//import "dotenv/config";
import dotenv from "dotenv";
import swaggerDocs from "config/swagger";

import authRoutes from "routes/auth.routes";
import userRoutes from "routes/user.routes";
import organizationRoutes from "routes/organization.routes";
import subscriptionRoutes from "routes/subscription.routes";

const app = express();

// Middlewares
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["x-auth-token", "x-refresh-token"],
  })
);
app.use(express.json());
app.set("trust proxy", true);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Ruta de prueba para verificar el servidor
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ERP/CRM API is running",
    results: null,
  });
});

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : process.env.NODE_ENV === "staging"
    ? ".env.staging"
    : ".env.dev";

dotenv.config({ path: envFile });
console.log(`Using environment file: ${envFile}`);

// Start server
const PORT = parseInt(process.env.PORT as string, 10) || 3000;
const ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`Server running in ${ENV || "development"} mode on port ${PORT}`);
  swaggerDocs(app, PORT);
});
