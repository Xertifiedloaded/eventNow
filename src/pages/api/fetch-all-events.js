import databaseConnection from "@/config/database";
import Event from "@/models/EventModel";

export default async function handler(req, res) {
  await databaseConnection();
  if (req.method === "GET") {
    try {
      const events = await Event.find({}); 
      res.status(200).json({ success: true, events });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}