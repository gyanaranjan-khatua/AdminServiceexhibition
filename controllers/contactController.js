import db from "../config/db.js";

export const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO contacts
      (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone || null,
        subject || null,
        message,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Contact request submitted successfully",
      contactId: result.insertId,
    });
  } catch (error) {
    console.error("Create contact error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit contact request",
    });
  }
};