import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const SubscriptionPayment = () => {
  const [templeDetails, setTempleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const ip = process.env.REACT_APP_BACKEND_IP

  useEffect(() => {
    const fetchTemple = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        Navigate("/Signin");
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
        console.error('Error fetching temple details', err);
      }
    };
  
    fetchTemple();
  }, []);
  

  const redirectToOmniware = (paymentUrl, paymentPayload) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;

    Object.keys(paymentPayload).forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = paymentPayload[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleProceed = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${ip}/api/payments/create-subscription`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const { paymentUrl, paymentPayload } = res.data;
      redirectToOmniware(paymentUrl, paymentPayload);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!templeDetails) return <p>Loading temple info...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Temple Subscription</h2>
      <div className="space-y-2">
        <p><strong>Temple Name:</strong> {templeDetails.name}</p>
        <p><strong>Email:</strong> {templeDetails.email}</p>
        <p><strong>Phone:</strong> {templeDetails.phone}</p>
        <p><strong>Address:</strong> {templeDetails.address}</p>
        <p><strong>Amount:</strong> ₹1000</p>
        <p><strong>GST:</strong> ₹180</p>
        <p><strong>Total:</strong> ₹1180</p>
      </div>

      <button
        onClick={handleProceed}
        disabled={loading}
        className="mt-6 w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
      >
        {loading ? 'Redirecting...' : 'Proceed to Pay'}
      </button>
    </div>
  );
};

export default SubscriptionPayment;
