import databaseConnection from "@/config/database"
import { generateToken } from "@/middleware/JsonWebToken"
import OrganizerModel from "@/models/OrganizerModel"

export default async function handler(req, res) {
  await databaseConnection()
  if (req.method === "POST") {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    try {
      const organizerExists = await OrganizerModel.findOne({ email })
      if (organizerExists) {
        return res.status(400).json({ message: "Organizer already exists" })
      }
      const newOrganizer = new OrganizerModel({ name, email, password })
      await newOrganizer.save()
      const token = generateToken(newOrganizer)
      res.status(201).json({ success: true, newOrganizer, token })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
