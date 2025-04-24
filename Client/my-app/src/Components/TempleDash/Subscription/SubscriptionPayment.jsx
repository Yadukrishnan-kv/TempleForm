import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './SubscriptionPayment.css';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import TemapleDashboard from '../TempleDashboard/TemapleDashboard';

const SubscriptionPayment = () => {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const apiKey = process.env.REACT_APP_OMNIWARE_API_KEY;
  const [templeDetails, setTempleDetails] = useState(null);
  const [hash, setHash] = useState('');
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '5.05',
    name: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    order_id: uuidv4().substring(0, 30),
    description: 'Annual subscription',
    mode: 'LIVE',
    return_url: `${ip}/api/payments/paymentResponse`,
    currency: 'INR',
    country: 'IND',
    zip_code: '000000',
    state: '',
    city: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchTemple = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/Signin');

      try {
        const res = await axios.get(`${ip}/api/temples/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const temple = res.data;
        setTempleDetails(temple);

        setFormData((prevData) => ({
          ...prevData,
          name: temple.name || '',
          email: temple.email || '',
          phone: temple.phone || '',
          address_line_1: temple.address || '',
          address_line_2: temple._id || '',
          city: temple.district || '',
          state: temple.state || '',
          zip_code: temple.address?.zip || '000000',
        }));
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch temple details.');
      }
    };

    fetchTemple();
  }, [ip, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${ip}/api/payments/paymentRequest`, formData);
      console.log("Form submitted with data:", formData);

      if (response.data.data) {
        setHash(response.data.data);
        setTimeout(() => {
          formRef.current.submit();
        }, 100);
      } else {
        alert('Missing required fields!');
      }
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Payment request error: Please try again.");
      }
      console.error('Payment request error:', error);
    }
  };

  useEffect(() => {
    if (templeDetails && templeDetails._id) {
      const fetchSubscriptions = async () => {
        try {
          const res = await axios.get(`${ip}/api/payments/temple-subscriptions/${templeDetails._id}`);
          setSubscriptions(res.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchSubscriptions();
    }
  }, [templeDetails, ip]);

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
    <div>
      <TemapleDashboard/>

      <div className="Subscription-container1">
        <h2 className="Subscription-h2">Annual Subscription</h2>
        
        <div className="subscriptiontoggle-button-container">
          <button onClick={() => setShowForm(!showForm)} className="subscriptiontoggle-btn">
            {showForm ? 'Cancel' : 'Subscription Form'}
          </button>
        </div>

        {showForm && (
          <form
            ref={formRef}
            className="Subscription-form-container"
            action="https://pgbiz.omniware.in/v2/paymentrequest"
            method="post"
          >
            <input type="hidden" name="api_key" value={apiKey} />
            <input type="hidden" name="hash" value={hash} />

            <div className="subscriptionform-group">
              <label>Amount*</label>
              <input type="text" name="amount" value={formData.amount} onChange={handleChange} required />
            </div>

            <div className="subscriptionform-group">
              <label>Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="subscriptionform-group">
              <label>Email*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="subscriptionform-group">
              <label>Phone*</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="subscriptionform-group">
              <label>Address </label>
              <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange} required />
            </div>

            <input type="hidden" name="address_line_2" value={formData.address_line_2} />

            <div className="subscriptionform-group">
              <label>Description*</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="subscriptionform-group">
              <label>City*</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="subscriptionform-group">
              <label>State*</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required />
            </div>

            <div className="subscriptionform-group">
              <label>Pin Code*</label>
              <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} required />
            </div>

            <input type="hidden" name="order_id" value={formData.order_id} />
            <input type="hidden" name="mode" value={formData.mode} />
            <input type="hidden" name="return_url" value={formData.return_url} />
            <input type="hidden" name="currency" value={formData.currency} />
            <input type="hidden" name="country" value={formData.country} />

            <div className="subscriptionform-group">
              <input type="submit" value="Pay Now" onClick={handleSubmit} className="subscriptionsubmit-btn" />
            </div>
          </form>
        )}

        {/* Show table only if there's at least one subscription */}
        {subscriptions.length > 0 && (
          <>
            <h2>Subscription Details</h2>
            <div className="Subscription-table-container">
              <table className="Subscription-subscription-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub.templeName}</td>
                      <td>{sub.address}</td>
                      <td>{new Date(sub.startDate).toDateString()}</td>
                      <td>{new Date(sub.endDate).toDateString()}</td>
                      <td>₹{sub.totalAmount}</td>
                      <td style={{ color: "red", fontWeight: "600" }}>{sub.paymentStatus}</td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPayment;



