
import axios from "axios";
import databaseConnection from "@/config/database";
import { verifyToken } from "@/middleware/auth";
import OrganizerModel from "@/models/OrganizerModel";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  await databaseConnection();

  if (req.method === "POST") {
    verifyToken(req, res, async () => {
      const organizerId = req.organizerId;
      try {
        const organizer = await OrganizerModel.findById(organizerId);
        if (!organizer) {
          return res.status(404).json({ error: "Organizer not found" });
        }

        const amount = 10000; 
        const reference = uuidv4(); 
        const response = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          {
            email: organizer.email,
            amount,
            reference,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          }
        );

        console.log(response.data); 

        if (response.data.status === true) {
          const paymentUrl = response.data.data.authorization_url;
          const paymentReference = response.data.data.reference;
          await OrganizerModel.findByIdAndUpdate(
            organizerId,
            { paymentReference }, 
            { new: true }
          );

          return res.status(200).json({
            message: "Package upgrade initiated",
            paymentUrl,
            paymentReference,
          });
        } else {
          return res.status(400).json({ error: "Payment not successful", details: response.data });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Payment initiation failed", details: error.response?.data || error.message });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
