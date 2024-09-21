import React, { useState } from 'react';
import axios from 'axios';

const UpgradeToPremium = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  
  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
    //   const token = localStorage.getItem('token'); 
    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWQ5MTQwNjNkYWVhNWQ2MTAwMTQ0MCIsImlhdCI6MTcyNjkwMDc2MCwiZXhwIjoxNzI2OTg3MTYwfQ.fHfcFG2ltVFvOwaFp5bKvA7Vakv69yK8-PYyZ0ddHt8'
      const response = await axios.post('/api/auth/premium', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setPaymentUrl(response.data.paymentUrl); 
      } else {
        setError(response.data.message || 'Failed to initiate payment.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upgrade to Premium</h2>
      <button 
        onClick={handleUpgrade} 
        className="bg-blue-500 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Upgrade Now'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {paymentUrl && (
        <div className="mt-4">
          <p className="text-green-500">Payment initiated! Click below to complete:</p>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Complete Payment
          </a>
        </div>
      )}
    </div>
  );
};

export default UpgradeToPremium;
