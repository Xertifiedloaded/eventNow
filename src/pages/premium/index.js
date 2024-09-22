// components/PaymentButton.js
import { useState } from 'react';

const PaymentButton = ({ organizerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWQ5MTQwNjNkYWVhNWQ2MTAwMTQ0MCIsImVtYWlsIjoiaG9ybGx5cGl6enlAZ21haWwuY29tIiwiaWF0IjoxNzI2OTkyODI4LCJleHAiOjE3MjcwNzkyMjh9.t8uWiJcM9X_NL1BAVonAPschyP6_DmDMbBbagiinCPQ' // Replace with your token retrieval method

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/premium/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ organizerId }), 
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Paystack payment URL
        window.location.href = data.paymentUrl; 
      } else {
        throw new Error(data.error || 'Payment initiation failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handlePayment} 
        disabled={loading} 
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default PaymentButton;
