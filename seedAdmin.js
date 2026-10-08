import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import db from "./config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    const name = "Service Exhibition Admin";
    const email = "admin@serviceexhibition.com";
    const password = "Admin@2026";

    // Check whether admin already exists
    const [existingAdmin] = await db.execute(
      "SELECT id FROM admins WHERE email = ?",
      [email]
    );

    if (existingAdmin.length > 0) {
      console.log(
        "Admin already exists. No new admin created."
      );

      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // Insert admin
    await db.execute(
      `INSERT INTO admins
      (name, email, password, role)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        "super_admin",
      ]
    );

    console.log(
      "Admin created successfully."
    );

    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to create admin:"
    );

    console.error(error.message);

    process.exit(1);
  }
};

seedAdmin();