import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./config/db.js";

import enquiryRoutes from "./routes/enquiryRoutes.js";
import usaEnquiryRoutes from "./routes/usaEnquiryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import companyEnquiryRoutes from "./routes/companyEnquiryRoutes.js";
dotenv.config();

const app = express();

app.use(
 cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Service Exhibition API is running",
  });
});

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/usa-enquiries", usaEnquiryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/company-enquiries",
  companyEnquiryRoutes
);
const PORT = process.env.PORT || 5000;

// Test database connection before starting server
const startServer = async () => {
  try {
    await db.query("SELECT 1");

    console.log("MySQL database connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("MySQL database connection failed");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();