import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './SubscriptionPayment.css';

const SubscriptionPayment = () => {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const [templeDetails, setTempleDetails] = useState(null);
  const [hash, setHash] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '1180',
    name: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    order_id: uuidv4(),
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const temple = res.data;
        setTempleDetails(temple);

        setFormData((prevData) => ({
          ...prevData,
          name: temple.name || '',
          email: temple.email || '',
          phone: temple.phone || '',
          address_line_1: temple.address || '',
          address_line_2: temple.address || '',
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
      if (response.data.data) {
        setHash(response.data.data);
        document.querySelector('form').submit();
      } else {
        alert('Missing required fields!');
      }
    } catch (error) {
      console.error('Payment request error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Subscription Payment</h2>
      <form className="subscription-form" action="https://pgbiz.omniware.in/v2/paymentrequest" method="post">
  <h2 className="form-title">Annual Subscription Payment</h2>
  <input type="hidden" name="api_key" value="your-api-key" />
  <input type="hidden" name="hash" value={hash} />

  <div className="form-group">
    <label>Amount*</label>
    <input type="text" name="amount" value={formData.amount} onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Name*</label>
    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Email*</label>
    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Phone*</label>
    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Address Line 1*</label>
    <input type="text" name="address_line_1" value={formData.address_line_1} onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>Address Line 2</label>
    <input type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Description*</label>
    <input type="text" name="description" value={formData.description} onChange={handleChange} required />
  </div>

  <div className="form-group">
    <label>City*</label>
    <input type="text" name="city" value={formData.city} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>State*</label>
    <input type="text" name="state" value={formData.state} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Zip Code*</label>
    <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} />
  </div>

  <input type="hidden" name="order_id" value={formData.order_id} />
  <input type="hidden" name="mode" value={formData.mode} />
  <input type="hidden" name="return_url" value={formData.return_url} />
  <input type="hidden" name="currency" value={formData.currency} />
  <input type="hidden" name="country" value={formData.country} />

  <div className="form-group">
    <input type="submit" value="Pay Now" onClick={handleSubmit} className="submit-btn" />
  </div>
</form>

    </div>
  );
};

export default SubscriptionPayment;

