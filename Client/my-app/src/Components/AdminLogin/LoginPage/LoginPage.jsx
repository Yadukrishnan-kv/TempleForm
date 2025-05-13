import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../SignupPage/SignupPage.css';

function LoginPage() {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  emailOrPhone: '',
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

  const { emailOrPhone, password } = formData;

  // Basic check to send either email or phone
  const isEmail = emailOrPhone.includes('@');

  const payload = {
    password,
    ...(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone })
  };

  try {
    const response = await axios.post(`${ip}/api/adminlogin/login`, payload);

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
    <label htmlFor="emailOrPhone">Email or Phone</label>
    <input
      type="text"
      id="emailOrPhone"
      name="emailOrPhone"
      value={formData.emailOrPhone}
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
  <p className="auth-link">Forgotten your password?</p>
</form>

    </div>
  );
}

export default LoginPage;





