import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    const verify = async () => {
      try {
        // Get parameters from URL
        const orderId = searchParams.get("order_id");
        const transactionId = searchParams.get("transaction_id");
        const paymentStatus = searchParams.get("status");
        
        if (!orderId || !transactionId) {
          setStatus("❌ Missing payment information");
          return;
        }

        console.log("Payment callback received:", { orderId, transactionId, paymentStatus });

        const res = await axios.post(`${ip}/api/payments/verify-payment`, {
          orderId,
          transactionId,
          status: paymentStatus
        });

        if (res.data.success) {
          setSubscription(res.data.subscription);
          setStatus("✅ Payment successful!");
        } else {
          setStatus("❌ Payment failed!");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("⚠️ Error verifying payment.");
      }
    };

    verify();
  }, [searchParams, ip]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white text-center">
      <h2 className="text-2xl font-bold mb-4">{status}</h2>
      {subscription && (
        <div className="text-left">
          <p><strong>Temple:</strong> {subscription.templeName}</p>
          <p><strong>Order ID:</strong> {subscription.orderId}</p>
          <p><strong>Transaction ID:</strong> {subscription.transactionId}</p>
          <p><strong>Total:</strong> ₹{subscription.totalAmount}</p>
          <p><strong>Start:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
          <p><strong>End:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
        </div>
      )}
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