import databaseConnection from "@/config/database";
import { verifyToken } from "@/middleware/auth";
import EventModel from "@/models/EventModel";
import OrganizerModel from "@/models/OrganizerModel";

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
        amount,
      } = req.body;

      try {
        const organizer = await OrganizerModel.findById(req.organizerId);
        if (!organizer) {
          return res.status(404).json({ success: false, message: "Organizer not found." });
        }
        if (organizer.packageType === "free" && organizer.eventCount >= 5) {
          return res.status(403).json({
            success: false,
            message: "You have reached the free event limit. Please upgrade to a premium package.",
          });
        }
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
          amount,
        });

        await newEvent.save();
        organizer.eventCount += 1;
        await organizer.save();

        res.status(200).json({ success: true, event: newEvent });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
