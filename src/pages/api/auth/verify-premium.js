import { verifyToken } from "@/middleware/auth";
import OrganizerModel from "@/models/OrganizerModel";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    verifyToken(req, res, async () => {
      const { paymentReference } = req.body; 
      const organizerId = req.organizerId; 

      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${paymentReference}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          }
        );

        console.log("Payment verification response:", response.data);
        
        const paymentStatus = response.data.data.status;
        if (paymentStatus === "success") {
          const organizer = await OrganizerModel.findByIdAndUpdate(
            organizerId,
            { packageType:"premium"}, 
            { new: true }
          );

          if (!organizer) {
            console.error("Failed to update organizer to premium.");
            return res.status(404).json({ success: false, message: "Organizer not found or update failed." });
          }

          res.status(200).json({ success: true, message: "Upgraded to premium", organizer });
        } else {
          res.status(400).json({ success: false, message: "Payment failed or incomplete." });
        }
      } catch (error) {
        console.error("Error during payment verification:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
