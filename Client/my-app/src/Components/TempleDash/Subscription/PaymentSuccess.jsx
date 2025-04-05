import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const [subscription, setSubscription] = useState(null);
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(`${ip}/api/payments/verify-payment`, {
          orderId,
          transactionId,
        });

        if (res.data.success) {
          setSubscription(res.data.subscription);
          setStatus("✅ Payment successful!");
        } else {
          setStatus("❌ Payment failed!");
        }
      } catch (err) {
        console.error(err);
        setStatus("⚠️ Error verifying payment.");
      }
    };

    if (orderId && transactionId) verify();
  }, [orderId, transactionId]);

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
    </div>
  );
};

export default PaymentSuccess;
