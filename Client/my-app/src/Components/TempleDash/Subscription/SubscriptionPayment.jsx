import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubscriptionPayment = () => {
  const [templeDetails, setTempleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    const fetchTemple = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/Signin");
        return;
      }

      try {
        const res = await axios.get(`${ip}/api/temples/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTempleDetails(res.data);
        console.log("Temple details fetched:", res.data);
      } catch (err) {
        console.error('Error fetching temple details:', err);
        setError("Failed to fetch temple details: " + (err.response?.data?.message || err.message));
      }
    };

    fetchTemple();
  }, [ip, navigate]);

  const handleProceed = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      console.log("Initiating payment process");
      const token = localStorage.getItem("token");
  
      console.log("Making API request to create subscription");
      const res = await axios.post(
        `${ip}/api/payments/create-subscription`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("API response received:", res.data);
      const { paymentUrl, paymentPayload } = res.data;
  
      if (paymentUrl && paymentPayload) {
        console.log("Creating payment form with URL:", paymentUrl);
  
        // Create a form element
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentUrl;
  
        // Append all paymentPayload fields as hidden inputs
        Object.keys(paymentPayload).forEach((key) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = paymentPayload[key];
          form.appendChild(input);
        });
  
        // Append the form to the body and submit it
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error("Invalid payment URL or payload");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setError("Payment initiation failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  

  if (!templeDetails && !error) {
    return <p className="text-center mt-10 text-gray-600">Loading temple info...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Temple Subscription</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {templeDetails && (
        <div className="space-y-2 text-gray-700">
          <p><strong>Temple Name:</strong> {templeDetails.name}</p>
          <p><strong>Email:</strong> {templeDetails.email}</p>
          <p><strong>Phone:</strong> {templeDetails.phone}</p>
          <p><strong>Address:</strong> {templeDetails.address}</p>
          <p><strong>Amount:</strong> ₹1000</p>
          <p><strong>GST (18%):</strong> ₹180</p>
          <p className="font-semibold"><strong>Total:</strong> ₹1180</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleProceed}
          disabled={loading || !templeDetails}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Note: You will be redirected to the Omniware payment gateway to complete your payment.</p>
      </div>
    </div>
  );
};

export default SubscriptionPayment;