import databaseConnection from "@/config/database";
import { verifyToken } from "@/middleware/auth";
import EventModel from "@/models/EventModel";

export default async function handler(req, res) {
  await databaseConnection();
  if (req.method === "POST") {
    verifyToken(req, res, async () => {
      const {
        eventName,
        category,
        aboutEvent,
        startDate,
        endDate,
        startTime,
        endTime,
        location,
        description,
        imageUrl,
        amount
      } = req.body;
      try {
        const newEvent = new EventModel({
          eventName,
          organizerId: req.organizerId,
          startDate,
          endDate,
          startTime,
          endTime,
          location,
          category,
          description,
          aboutEvent,
          imageUrl,
          amount
        });
        await newEvent.save();
        res.status(200).json({ success: true, event: newEvent });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
