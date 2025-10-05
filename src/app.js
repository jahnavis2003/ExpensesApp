import express, { json } from "express";
import expensesRoutes from "./routes/expensesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();

// Middleware
app.use(json());
app.use(cors())

// Routes
app.use("/api/expenses", expensesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // Assuming auth routes are handled in userRoutes

// Error handler (last middleware)
app.use(errorHandler);

export default app;
