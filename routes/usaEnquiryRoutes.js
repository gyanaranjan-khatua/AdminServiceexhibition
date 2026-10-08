import express from "express";
import {
  createUSAEnquiry,
} from "../controllers/usaEnquiryController.js";

const router = express.Router();

router.post("/", createUSAEnquiry);

export default router;