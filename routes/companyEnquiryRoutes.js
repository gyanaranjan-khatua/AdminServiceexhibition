import express from "express";

import {
  createCompanyEnquiry,
} from "../controllers/companyEnquiryController.js";

const router = express.Router();

router.post("/", createCompanyEnquiry);

export default router;