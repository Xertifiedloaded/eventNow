import databaseConnection from "@/config/database"
import { verifyToken } from "@/middleware/auth"
import OrganizerModel from "@/models/OrganizerModel"

export default async function handler(req, res) {
  await databaseConnection()
  if (req.method === "PUT") {
    verifyToken(req, res, async () => {
      const userId = req.organizerId
      console.log(
        `${userId} i know i will solve this mfk bug one day keep buzzing na your time??`
      )
      try {
        const { name, email, paystackPublicKey } = req.body
        console.log(req.body);
        
        const updatedUser = await OrganizerModel.findByIdAndUpdate(
          userId,
          { name, email, paystackPublicKey },
          { new: true, runValidators: true }
        )
        console.log(
          `${updatedUser} is like God wan punish you with the way you dey wahala me ba??`
        )

        if (!updatedUser) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" })
        }

        const userResponse = {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          paystackPublicKey: updatedUser.paystackPublicKey,
        }
console.log(userResponse.paystackPublicKey);

        res.status(200).json({ success: true, user: userResponse })
      } catch (error) {
        res.status(500).json({ success: false, error: error.message })
      }
    })
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
