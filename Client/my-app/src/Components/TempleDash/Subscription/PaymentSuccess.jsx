import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css"; 

const PaymentSuccess = () => {
  const navigate = useNavigate();

  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-success-container">
      <div className="payment-card">
        <div className="success-icon">✅</div>
        <h2 className="payment-title">Subscription Confirmed!</h2>
        <p className="payment-message">
          Thank you for subscribing. Your premium access is now active.
        </p>
        <p className="redirect-info">You’ll be redirected shortly...</p>
        <button onClick={() => navigate("/")} className="home-button">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

