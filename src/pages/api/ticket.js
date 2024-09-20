import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import EventModel from "@/models/EventModel";
import databaseConnection from "@/config/database";
import TicketModel from "../../models/TicketModel";
import axios from "axios";

export default async function handler(req, res) {
  await databaseConnection();
  if (req.method === "POST") {
    const { eventId, buyerName, buyerEmail } = req.body;
    if (!eventId || !buyerName || !buyerEmail) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    try {
      const event = await EventModel.findOne({ eventId });
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found." });
      }
      const amount = event.amount;
      const ticketId = uuidv4();
      const qrCodeUrl = await QRCode.toDataURL(ticketId);
      const newTicket = new TicketModel({
        eventId,
        buyerName,
        buyerEmail,
        qrCodeUrl,
        ticketId,
        paymentStatus: "pending",
      });

      await newTicket.save();
      const paymentResponse = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: buyerEmail,
          amount: amount * 100,
          reference: ticketId,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentUrl = paymentResponse.data.data.authorization_url;
      res.status(200).json({ success: true, ticketId, paymentUrl, qrCodeUrl });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
