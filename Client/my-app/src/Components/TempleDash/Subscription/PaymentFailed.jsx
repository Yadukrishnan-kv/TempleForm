import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Payment Failed</h2>
      <p>Something went wrong with the payment. Please try again.</p>
      <button 
        onClick={() => navigate("/")} 
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
      >
        Back to Home
      </button>
    </div>
  );
};

export default PaymentFailed;
