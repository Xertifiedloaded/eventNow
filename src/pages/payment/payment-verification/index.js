import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PaymentVerification = () => {
  const router = useRouter();
  const { reference } = router.query;
  const [verificationStatus, setVerificationStatus] = useState("Verifying...");

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }
  }, [reference]);

  const verifyPayment = async (reference) => {
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();
      if (data.success) {
        setVerificationStatus("Payment successful! Ticket is confirmed.");
      } else {
        setVerificationStatus("Payment verification failed.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setVerificationStatus("Error during payment verification.");
    }
  };

  return (
    <div>
      <h1>{verificationStatus}</h1>
    </div>
  );
};

export default PaymentVerification;