import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../SignupPage/SignupPage.css';

function LoginPage() {
  const ip = process.env.REACT_APP_BACKEND_IP
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${ip}/api/adminlogin/login`, formData );
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/Dashboard');
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      alert('Error logging in. Please check your credentials and try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Log In</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-button">Log In</button>
        <p className="auth-link">
          Don't have an account? <a href="/AdminSignup">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;

