import { useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"

const PaymentConfirmation = () => {
  const router = useRouter()
  const { reference } = router.query

  useEffect(() => {
    if (reference) {
      const verifyPayment = async () => {
        try {
          const response = await axios.get(
            `/api/premium/confirmation?reference=${reference}`
          )
          console.log("Payment confirmed", response.data)
        } catch (err) {
          console.error("Payment verification failed", err)
        }
      }
      verifyPayment()
    }
  }, [reference])

  return <div>Verifying payment...</div>
}

export default PaymentConfirmation
