import databaseConnection from "@/config/database";
import TicketModel from "@/models/TicketModel";

export default async function handler(req, res) {
  await databaseConnection();
  
  if (req.method === 'POST') {
    const { qrCode, ticketId } = req.body;
    if (!qrCode && !ticketId) {
      return res.status(400).json({ valid: false, message: 'Either qrCode or ticketId is required' });
    }
    try {
      let ticket;
      if (qrCode) {
        ticket = await TicketModel.findOne({ qrCodeUrl: qrCode });
      } else if (ticketId) {
        ticket = await TicketModel.findOne({ ticketId: ticketId });
      }
      if (ticket) {
        if (ticket.paymentStatus === 'paid') {
          return res.status(200).json({ valid: true, ticket });
        } else {
          return res.status(400).json({ valid: false, message: 'Ticket not paid' });
        }
      } else {
        return res.status(404).json({ valid: false, message: 'Oooooops Ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}