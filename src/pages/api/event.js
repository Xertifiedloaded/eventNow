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
      if (
        !eventName ||
        !category ||
        !aboutEvent ||
        !startDate ||
        !endDate ||
        !startTime ||
        !endTime ||
        !location ||
        !description ||
        !amount
      ) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

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
        res.status(200).json({ success: true, newEvent });
      } catch (error) {
        console.log("Error creating event:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
