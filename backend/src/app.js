import express from "express";
import cors from "cors";
import companyRoutes from "./routes/company.routes.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";

const app = express();

app.use(cors());
// Increase payload limit to 50MB for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);

app.get("/ping", (req, res) => {
  res.json({ message: "Dayflow API running" });
});

export default app;
