import express from "express";

import {
  adminLogin,
  getDashboardStats,
  getEnquiries,
  getUSAEnquiries,
  getContacts,

  getCompanyEnquiries,

  updateEnquiryStatus,
  updateUSAEnquiryStatus,
  updateContactStatus,
  updateCompanyEnquiryStatus,

  deleteEnquiry,
  deleteUSAEnquiry,
  deleteContact,
  deleteCompanyEnquiry,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
=====================================================
PUBLIC ADMIN LOGIN
=====================================================
*/

router.post("/login", adminLogin);


/*
=====================================================
PROTECTED ADMIN ROUTES
=====================================================
*/

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);


/* Product / Order Enquiries */

router.get(
  "/enquiries",
  authMiddleware,
  getEnquiries
);

router.patch(
  "/enquiries/:id/status",
  authMiddleware,
  updateEnquiryStatus
);

router.delete(
  "/enquiries/:id",
  authMiddleware,
  deleteEnquiry
);


/* USA Enquiries */

router.get(
  "/usa-enquiries",
  authMiddleware,
  getUSAEnquiries
);

router.patch(
  "/usa-enquiries/:id/status",
  authMiddleware,
  updateUSAEnquiryStatus
);

router.delete(
  "/usa-enquiries/:id",
  authMiddleware,
  deleteUSAEnquiry
);


/* Contact Requests */

router.get(
  "/contacts",
  authMiddleware,
  getContacts
);

router.patch(
  "/contacts/:id/status",
  authMiddleware,
  updateContactStatus
);

router.get(
  "/company-enquiries",
  authMiddleware,
  getCompanyEnquiries
);

router.patch(
  "/company-enquiries/:id/status",
  authMiddleware,
  updateCompanyEnquiryStatus
);

router.delete(
  "/company-enquiries/:id",
  authMiddleware,
  deleteCompanyEnquiry
);
router.delete(
  "/contacts/:id",
  authMiddleware,
  deleteContact
);

export default router;