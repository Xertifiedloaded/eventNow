import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const TicketPurchase = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    if (router.isReady && !eventId) {
      router.push('/'); 
    }
  }, [router.isReady, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          buyerName,
          buyerEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentUrl(data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error during ticket purchase:', error);
      alert('An error occurred during the purchase.');
    } finally {
      setLoading(false);
    }
  };

  if (!router.isReady) return <div>Loading...</div>;

  return (
    <div>
  
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="buyerName">Name:</label>
          <input
            id="buyerName"
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="buyerEmail">Email:</label>
          <input
            id="buyerEmail"
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading || !eventId}>
          {loading ? 'Processing...' : 'Purchase'}
        </button>
      </form>

      {paymentUrl && (
        <div>
          <p>Redirecting to payment gateway...</p>
        </div>
      )}
    </div>
  );
};

export default TicketPurchase;