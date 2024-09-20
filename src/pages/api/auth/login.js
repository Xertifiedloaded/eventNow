import databaseConnection from "@/config/database";
import OrganizerModel from "@/models/OrganizerModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await databaseConnection();

  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      const organizer = await OrganizerModel.findOne({ email });
      if (!organizer) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      const isMatch = await bcrypt.compare(password, organizer.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: organizer._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({ success: true, token, organizer });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
