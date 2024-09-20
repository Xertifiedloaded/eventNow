import databaseConnection from "@/config/database";
import { verifyToken } from "@/middleware/auth";
import EventModel from "@/models/EventModel";
import TicketModel from "@/models/TicketModel";

export default async function handler(req, res) {
  await databaseConnection();
  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      const organizerId = req.organizerId; 
      try {
        const events = await EventModel.find({ organizerId });
        if (events.length === 0) {
          return res.status(200).json({ success: true, tickets: [] });
        }
        const eventIds = events.map(event => event.eventId);
        const tickets = await TicketModel.find({ eventId: { $in: eventIds } });
        res.status(200).json({ success: true, tickets });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}