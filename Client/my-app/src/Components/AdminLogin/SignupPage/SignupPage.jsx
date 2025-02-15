import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { toast } from 'react-toastify';

function SignupPage() {
  const ip = process.env.REACT_APP_BACKEND_IP
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${ip}/api/adminlogin/register`, formData);
      console.log(response.data);
      toast.success(" successfully Signuped!", {
              position: "top-right",
              autoClose: 3000,
            });
      navigate('/AdminLogin');
    } catch (error) {
      console.error('Error signing up:', error.response ? error.response.data : error.message);
            toast.error("Error signing up. Please try again.!");
      
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Sign Up</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
       
        <button type="submit" className="auth-button">Sign Up</button>
        <p className="auth-link">
          Already have an account? <a href="/AdminLogin">Log in</a>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;

