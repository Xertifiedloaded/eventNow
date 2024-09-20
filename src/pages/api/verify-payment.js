import TicketModel from "@/models/TicketModel";
import axios from "axios";
import databaseConnection from "@/config/database";

export default async function handler(req, res) {
  await databaseConnection();
  if (req.method === "POST") {
    const { reference } = req.body;
    try {
      const verificationResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });
      const paymentStatus = verificationResponse.data.data.status;
      const ticket = await TicketModel.findOne({ ticketId: reference });
      if (!ticket) {
        return res.status(404).json({ success: false, message: "Ticket not found" });
      }
      if (paymentStatus === "success") {
        ticket.paymentStatus = "paid";
        await ticket.save();
        res.status(200).json({ success: true, message: "Payment verified, ticket updated to paid." });
      } else {
        res.status(400).json({ success: false, message: "Payment verification failed." });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}