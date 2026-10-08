import db from "../config/db.js";

export const createUSAEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      website,
      message,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO usa_enquiries
      (name, email, phone, company, website, message)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone || null,
        company || null,
        website || null,
        message || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "USA enquiry submitted successfully",
      enquiryId: result.insertId,
    });
  } catch (error) {
    console.error("Create USA enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit USA enquiry",
    });
  }
};