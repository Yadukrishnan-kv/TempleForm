import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubscriptionPayment = () => {
  const [templeDetails, setTempleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
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
      } catch (err) {
        console.error('Error fetching temple details:', err);
        alert("Failed to fetch temple details.");
      }
    };

    fetchTemple();
  }, [ip, navigate]);

  const redirectToOmniware = (paymentUrl, paymentPayload) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;

    Object.entries(paymentPayload).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleProceed = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${ip}/api/payments/create-subscription`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { paymentUrl, paymentPayload } = res.data;

      if (paymentUrl && paymentPayload) {
        redirectToOmniware(paymentUrl, paymentPayload);
      } else {
        alert("Invalid payment data received.");
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!templeDetails) {
    return <p className="text-center mt-10 text-gray-600">Loading temple info...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Temple Subscription</h2>
      
      <div className="space-y-2 text-gray-700">
        <p><strong>Temple Name:</strong> {templeDetails.name}</p>
        <p><strong>Email:</strong> {templeDetails.email}</p>
        <p><strong>Phone:</strong> {templeDetails.phone}</p>
        <p><strong>Address:</strong> {templeDetails.address}</p>
        <p><strong>Amount:</strong> ₹1000</p>
        <p><strong>GST (18%):</strong> ₹180</p>
        <p className="font-semibold"><strong>Total:</strong> ₹1180</p>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleProceed}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPayment;
