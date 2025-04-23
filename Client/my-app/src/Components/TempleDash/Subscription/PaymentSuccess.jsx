import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Payment successful!</h2>
      <p>Your subscription is now active. Thank you!</p>
      <button 
        onClick={() => navigate("/")} 
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
      >
        Back to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
