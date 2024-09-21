import { verifyToken } from "@/middleware/auth";
import OrganizerModel from "@/models/OrganizerModel";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    verifyToken(req, res, async () => {
      const premiumAmount = 10000;
      const organizerId = req.organizerId;

      try {
        const organizer = await OrganizerModel.findById(organizerId);
        if (!organizer) {
          return res.status(404).json({ success: false, message: "Organizer not found." });
        }

        const organizerEmail = organizer.email; 
        console.log(organizerEmail);
        
        if (!organizerEmail) {
          return res.status(400).json({ success: false, message: "Organizer email not found." });
        }

        const paymentResponse = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          {
            email: organizerEmail, 
            amount: premiumAmount, 
            reference: `premium-${organizerId}`,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const paymentUrl = paymentResponse.data.data.authorization_url;
        
        res.status(200).json({
          success: true,
          paymentUrl,
        });
      } catch (error) {
        console.error("Error during payment initialization:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
