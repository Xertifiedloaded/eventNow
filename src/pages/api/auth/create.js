import databaseConnection from "@/config/database";
import OrganizerModel from "@/models/OrganizerModel";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await databaseConnection();
  if (req.method === "POST") {
    const { name, email, password } = req.body;
    try {
      const organizerExists = await OrganizerModel.findOne({ email });
      if (organizerExists) {
        return res.status(400).json({ message: "Organizer already exists" });
      }
      const newOrganizer = new OrganizerModel({ name, email, password });
      await newOrganizer.save();
      const token = jwt.sign({ id: newOrganizer._id }, "jdjjdsnjdcjnieiwow", {
        expiresIn: "1d",
      });
      res.status(201).json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
