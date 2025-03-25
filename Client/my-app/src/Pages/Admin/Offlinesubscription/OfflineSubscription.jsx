import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import './Offlinesubscription.css'
import { useLocation } from 'react-router-dom';
function OfflineSubscription() {
    const ip = process.env.REACT_APP_BACKEND_IP;
    const [subscriptions, setSubscriptions] = useState([]);
    const location = useLocation();
    const { templeData } = location.state || {}; // Access state correctly
  
    console.log(templeData); // Check if templeData is passed correctly
   const [formData, setFormData] = useState({
    templeName: '',
    address:'',
    templeId:"",
    email: '',
    number: '',
  });
 

  useEffect(() => {
    if (templeData) {
      setFormData(() => ({
      
        templeName: templeData.name || '',
        templeId: templeData._id || '',
        address: templeData.address || '',
        email: templeData.email || '',
        number: templeData.phone || '',

      }));
    }
  }, [templeData]);


  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch all subscriptions
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${ip}/api/payments/create-offlinesubscription`, formData);
      alert('Subscription added successfully!');
      setFormData({ templeName: '', email: '', number: '' });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  // Download Invoice
  const downloadInvoice = async (id) => {
    try {
      window.open(`${ip}/api/payments/offlineSubscriptions/invoice/${id}`, '_blank');
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };
  
  
  return (


    <div className="app-container">
    <Header />
    <div className="content-container">
      <Sidebar />

    <div className="Subscription-container">
      <h2 className='Subscription-h2'>Add Offline Subscription</h2>
      <form onSubmit={handleSubmit} className="Subscription-form-container">
        <div className='Subscription-form'>
          <label className='Subscription-label '>Temple Name:</label>
          <input type="text" name="templeName" value={formData.templeName} onChange={handleChange} className='Subscription-input' required />
        </div>
        <div className='Subscription-form'>
          <label className='Subscription-label '>Temple Address:</label>
          <input type="text" name="templeName" value={formData.address} onChange={handleChange} className='Subscription-input' required />
        </div>
        <div className='Subscription-form'>
          <label className='Subscription-label '>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className='Subscription-input' required />
        </div>
        <div className='Subscription-form'>
          <label className='Subscription-label '>Number:</label>
          <input type="text" name="number" value={formData.number} onChange={handleChange} className='Subscription-input' required />
        </div>
        <div className="Subscription-amount-info">
          <p>Start Date: {new Date().toDateString()}</p>
          <p>End Date: {new Date(new Date().setMonth(new Date().getMonth() + 12)).toDateString()}</p>
          <p>Amount: ₹1000</p>
          <p>GST (18%): ₹180</p>
          <p>Total Amount: ₹1180</p>
        </div>
        <button type="submit" className='Subscription-button'>Add Subscription</button>
      </form>

      <h2>Subscription Details</h2>

{/* Table Container with Scroll */}
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
          <td>
            <button
              onClick={() => downloadInvoice(sub._id)}
              className="Subscription-button"
            >
              Download Invoice
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
};
export default OfflineSubscription