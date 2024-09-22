import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const eventCategories = [
  "Music",
  "Sports",
  "Conference",
  "Workshop",
  "Festival",
  "Charity",
];

const EventSchema = new mongoose.Schema({
  eventId: { type: String, default: uuidv4 },
  eventName: { type: String, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organizer', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  aboutEvent: { type: String },
  location: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  amount: { type: Number },
  category: {
    type: String,
    enum: eventCategories,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
