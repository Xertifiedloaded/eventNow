import databaseConnection from "@/config/database"
import { generateToken } from "@/middleware/JsonWebToken"
import OrganizerModel from "@/models/OrganizerModel"
import bcrypt from "bcryptjs"


export default async function handler(req, res) {
  await databaseConnection()

  if (req.method === "POST") {
    const { email, password } = req.body
    try {
      const organizer = await OrganizerModel.findOne({ email })
      if (!organizer) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      const isMatch = await bcrypt.compare(password, organizer.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
      }
      generateToken(organizer)
      res.status(200).json({
        success: true,
        organizer,
        organizerPublicKey: organizer.organizerPublicKey,
      })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
