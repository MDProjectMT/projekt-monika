import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";

const app = express();

dotenv.config();

const loggerFormat = app.get("env") === "development" ? "dev" : "short";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(loggerFormat));
app.use(helmet());

app.use("/api/auth", authRoutes);

export default app;
