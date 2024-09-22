import crypto from 'crypto';

export default async function handler(req, res) {
  await databaseConnection();

  if (req.method === "POST") {
    const signature = req.headers['x-paystack-signature'];
    const expectedSignature = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(403).json({ error: "Invalid signature" });
    }

    const { event, data } = req.body;

    if (event === "charge.success") {
      const paymentReference = data.reference;

      try {
        const organizer = await OrganizerModel.findOneAndUpdate(
          { paymentReference },
          { packageType: "premium" },
          { new: true }
        );

        if (!organizer) {
          return res.status(404).json({ error: "Organizer not found" });
        }

        return res.status(200).json({ message: "Package upgraded to premium" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database update failed", details: error.message });
      }
    }

    return res.status(200).json({ message: "Event received" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
