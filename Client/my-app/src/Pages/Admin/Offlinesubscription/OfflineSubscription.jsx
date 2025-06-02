import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Offlinesubscription.css';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Importing toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the necessary styles for the toast

function OfflineSubscription() {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const [subscriptions, setSubscriptions] = useState([]);
  const location = useLocation();
  const { templeData } = location.state || {};

  const [formData, setFormData] = useState({
    templeName: '',
    address: '',
    templeId: '',
    email: '',
    number: '',
  });

  useEffect(() => {
    if (templeData) {
      setFormData({
        templeName: templeData.name || '',
        templeId: templeData._id || '',
        address: templeData.address || '',
        email: templeData.email || '',
        number: templeData.phone || '',
      });
    }
  }, [templeData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get(`${ip}/api/payments/temple-subscriptions/${templeData._id}`);
      setSubscriptions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
     // Check if the user already has an active subscription
     const existingSubscription = subscriptions.find(sub => sub.email === formData.email && sub.templeId === formData.templeId && new Date(sub.endDate) > new Date());

     if (existingSubscription) {
       toast.error("You are already subscribed. Please wait until your current subscription ends before subscribing again.");
       return;
     }
    try {
      await axios.post(`${ip}/api/payments/create-offlinesubscription`, formData);
      alert('Subscription added successfully!');
      setFormData({ ...formData }); // reset if needed
      fetchSubscriptions();
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const response = await fetch(`${ip}/api/payments/offlineSubscriptions/invoice/${id}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to download invoice');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  return (
    <div >
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="Subscription-container">
          <h2 className="Subscription-h2">Offline Subscription</h2>
          <form onSubmit={handleSubmit} className="Subscription-form-container">
            <div className="Subscription-form">
              <label className="Subscription-label">Temple Name:</label>
              <input type="text" name="templeName" value={formData.templeName} onChange={handleChange} className="Subscription-input" required />
            </div>
            <div className="Subscription-form">
              <label className="Subscription-label">Temple Address:</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="Subscription-input" required />
            </div>
            <div className="Subscription-form">
              <label className="Subscription-label">Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="Subscription-input" required />
            </div>
            <div className="Subscription-form">
              <label className="Subscription-label">Number:</label>
              <input type="text" name="number" value={formData.number} onChange={handleChange} className="Subscription-input" required />
            </div>
            <div className="Subscription-amount-info">
              <p>Start Date: {new Date().toDateString()}</p>
              <p>End Date: {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toDateString()}</p>
              <p>Amount: ₹1000</p>
              <p>GST (18%): ₹180</p>
              <p>Total Amount: ₹1180</p>
            </div>
            <button type="submit" className="Subscription-button">Add Subscription</button>
          </form>

          <h2>Subscription Details</h2>
          <div className="Subscription-table-container">
            <table className="Subscription-subscription-table">
              <thead>
                <tr>
                  <th>Temple Name</th>
                  <th>Temple Address</th>
                  <th>Email</th>
                  <th>Number</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub._id}>
                    <td>{sub.templeName}</td>
                    <td>{sub.address}</td>
                    <td>{sub.email}</td>
                    <td>{sub.number}</td>
                    <td>{new Date(sub.startDate).toDateString()}</td>
                    <td>{new Date(sub.endDate).toDateString()}</td>
                    <td>₹{sub.totalAmount}</td>
                    <td>{sub.paymentStatus}</td>
                    <td>
                      <button onClick={() => downloadInvoice(sub._id)} className="Subscription-button">
                        Download 
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
export default OfflineSubscription;
