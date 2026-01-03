import express from "express";
import cors from "cors";
import companyRoutes from "./routes/company.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);

app.get("/ping", (req, res) => {
  res.json({ message: "Dayflow API running" });
});

export default app;
