import db from "../config/db.js";

export const createCompanyEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      product,
      message,
    } = req.body;

    if (!name || !email || !phone || !product) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone and product are required",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO company_enquiries
      (name, email, phone, product, message)
      VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        product,
        message || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Company registration enquiry submitted successfully",
      enquiryId: result.insertId,
    });
  } catch (error) {
    console.error(
      "Create company enquiry error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to submit company registration enquiry",
    });
  }
};