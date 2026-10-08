import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =====================================================
   ADMIN LOGIN
===================================================== */

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin from database
    const [admins] = await db.execute(
      `SELECT id, name, email, password, role
       FROM admins
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const admin = admins[0];

    // Compare entered password with bcrypt hash
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};


/* =====================================================
   DASHBOARD COUNTS
===================================================== */
export const getDashboardStats = async (req, res) => {
  try {
    const [[enquiriesStats]] = await db.execute(`
      SELECT
        COUNT(*) AS totalEnquiries,
        SUM(status = 'new') AS newEnquiries
      FROM enquiries
    `);

    const [[usaStats]] = await db.execute(`
      SELECT
        COUNT(*) AS totalUSAEnquiries,
        SUM(status = 'new') AS newUSAEnquiries
      FROM usa_enquiries
    `);

    const [[contactStats]] = await db.execute(`
      SELECT
        COUNT(*) AS totalContacts,
        SUM(status = 'new') AS newContacts
      FROM contacts
    `);

    const [[companyStats]] = await db.execute(`
      SELECT
        COUNT(*) AS totalCompanyEnquiries,
        SUM(status = 'new') AS newCompanyEnquiries
      FROM company_enquiries
    `);

    res.json({
      success: true,
      stats: {
        totalEnquiries: Number(enquiriesStats.totalEnquiries || 0),
        newEnquiries: Number(enquiriesStats.newEnquiries || 0),

        totalUSAEnquiries: Number(
          usaStats.totalUSAEnquiries || 0
        ),
        newUSAEnquiries: Number(
          usaStats.newUSAEnquiries || 0
        ),

        totalContacts: Number(
          contactStats.totalContacts || 0
        ),
        newContacts: Number(
          contactStats.newContacts || 0
        ),

        totalCompanyEnquiries: Number(
          companyStats.totalCompanyEnquiries || 0
        ),
        newCompanyEnquiries: Number(
          companyStats.newCompanyEnquiries || 0
        ),
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};


/* =====================================================
   GET PRODUCT ENQUIRIES
===================================================== */

export const getEnquiries = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT *
       FROM enquiries
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      count: rows.length,
      enquiries: rows,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
    });
  }
};


/* =====================================================
   GET USA ENQUIRIES
===================================================== */

export const getUSAEnquiries = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT *
       FROM usa_enquiries
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      count: rows.length,
      enquiries: rows,
    });
  } catch (error) {
    console.error("Get USA enquiries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch USA enquiries",
    });
  }
};

export const getCompanyEnquiries = async (req, res) => {
  try {
    const [enquiries] = await db.execute(
      "SELECT * FROM company_enquiries ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      enquiries,
    });
  } catch (error) {
    console.error("Get company enquiries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch company registration enquiries",
    });
  }
};

export const updateCompanyEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "contacted",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [result] = await db.execute(
      `UPDATE company_enquiries
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Company enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Company enquiry status updated successfully",
    });
  } catch (error) {
    console.error(
      "Update company enquiry status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update company enquiry status",
    });
  }
};

export const deleteCompanyEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM company_enquiries WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Company enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Company enquiry deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete company enquiry error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete company enquiry",
    });
  }
};
/* =====================================================
   GET CONTACTS
===================================================== */

export const getContacts = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT *
       FROM contacts
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      count: rows.length,
      contacts: rows,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
};


/* =====================================================
   UPDATE PRODUCT ENQUIRY STATUS
===================================================== */

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "contacted",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status",
      });
    }

    const [result] = await db.execute(
      `UPDATE enquiries
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Enquiry status updated successfully",
    });
  } catch (error) {
    console.error("Update enquiry status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update enquiry status",
    });
  }
};


/* =====================================================
   UPDATE USA ENQUIRY STATUS
===================================================== */

export const updateUSAEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "contacted",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid USA enquiry status",
      });
    }

    const [result] = await db.execute(
      `UPDATE usa_enquiries
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "USA enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "USA enquiry status updated successfully",
    });
  } catch (error) {
    console.error("Update USA enquiry status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update USA enquiry status",
    });
  }
};


/* =====================================================
   UPDATE CONTACT STATUS
===================================================== */

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "read",
      "replied",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact status",
      });
    }

    const [result] = await db.execute(
      `UPDATE contacts
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact status updated successfully",
    });
  } catch (error) {
    console.error("Update contact status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update contact status",
    });
  }
};


/* =====================================================
   DELETE PRODUCT ENQUIRY
===================================================== */

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM enquiries WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
    });
  }
};


/* =====================================================
   DELETE USA ENQUIRY
===================================================== */

export const deleteUSAEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM usa_enquiries WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "USA enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "USA enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete USA enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete USA enquiry",
    });
  }
};


/* =====================================================
   DELETE CONTACT
===================================================== */

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM contacts WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
};