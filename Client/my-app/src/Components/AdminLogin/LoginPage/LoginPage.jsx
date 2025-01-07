import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../SignupPage/SignupPage.css';

function LoginPage() {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${ip}/api/adminlogin/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/Dashboard');
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Error logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Log In</h2>
        {error && <div className="auth-error">{error}</div>}
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
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
        <p className="auth-link">
          Forgotten your password?
        </p>
      </form>
    </div>
  );
}

export default LoginPage;





