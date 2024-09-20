
import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  eventId: { type: String, ref: "Event" },
  buyerName: String,
  buyerEmail: String,
  qrCodeUrl: String,
  ticketId: String,
  paymentStatus: { type: String, default: "unpaid" },
  purchaseDate: { type: Date, default: Date.now },
});

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
