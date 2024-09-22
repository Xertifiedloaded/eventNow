import { useEffect } from 'react';
import { useRouter } from 'next/router';

const PremiumSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('User upgraded to premium');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-6">Payment Successful!</h2>
        <p className="text-gray-700 mb-4">Thank you for upgrading to premium. Enjoy your exclusive features.</p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PremiumSuccess;
