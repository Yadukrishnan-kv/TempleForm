import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Navbar from './Navbar';
import Footer from './Footer';
import './HomePage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from 'react-toastify';

function Signup() {
  const ip = process.env.REACT_APP_BACKEND_IP;

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match!");
    return;
  }
  setLoading(true);
  try {
    // Ensure fullName is being sent in the request
    const res = await axios.post(`${ip}/api/UserRoutes/registerUser`, formData);
    toast.success(res.data.message); // Notify the user
    setShowOtpField(true); // Show OTP field after successful registration
    setError('');
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred");
  } finally {
    setLoading(false);
  }
};

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 2: Verify the OTP entered by the user
      const res = await axios.post(`${ip}/api/UserRoutes/verify-otp`, { email: formData.email, otp });
      toast.success(res.data.message); // Notify OTP verification success
      setShowOtpField(false); // Hide OTP input
      navigate('/Signin'); // Redirect user to the login page after successful OTP verification
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-3 p-sm-5">
        <div className="row g-4 g-xl-5 justify-content-between">
          <div className="col-xl-5 d-flex justify-content-center">
            <div className="authentication-wrap overflow-hidden position-relative text-center text-sm-start my-5">
              <div className="mb-5">
                <h2 className="display-6 fw-semibold mb-3">Welcome! Please <span className="font-caveat text-primary">Sign up</span> to continue.</h2>
                <p>Join our community to unlock exclusive features and updates.</p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {!showOtpField ? (
                <form className="register-form" onSubmit={handleSubmit}>
                  <div className="Signup-form-group mb-4">
  <label className="required">Full Name</label>
  <input 
    type="text" 
    className="form-control" 
    name="fullName" 
    value={formData.fullName} 
    onChange={handleChange} 
    required 
  />
</div>
                  <div className="Signup-form-group mb-4">
                    <label className="required">Enter Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="Signup-form-group mb-4">
                    <label className="required">Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <i
                        className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`}
                        onClick={() => togglePasswordVisibility('password')}
                      ></i>
                    </div>
                  </div>
                  <div className="Signup-form-group mb-4">
                    <label className="required">Confirm Password</label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <i
                        className={`fa ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`}
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                      ></i>
                    </div>
                  </div>
                  <div className="form-check mb-4 text-start">
                  <input className="form-check-input" type="checkbox" id="termsCheck" required />
                  <label className="form-check-label" htmlFor="termsCheck"> By signing up, you agree to the terms of service </label>
                </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Processing..." : "Sign Up"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit}>
                  <div className="Signup-form-group mb-4">
                    <label className="required">Enter OTP</label>
                    <input
                      type="text"
                      className="form-control"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              )}

<div className="bottom-text mt-4"> Already have an account? <Link to="/signin" className="fw-medium text-decoration-underline text-dark">Sign In</Link> </div>
            </div>
            
          </div>
          <div className="col-xl-7 d-none d-xl-block">
            <div className="background-image bg-light d-flex flex-column h-100 justify-content-center p-5 rounded-4" data-image-src="assets/images/lines.svg">
              <div className="py-5 text-center">
                <div className="mb-5">
                  <h2 className="fw-semibold">Effortlessly organize your<br /> workspace with ease.</h2>
                  <p>It is a long established fact that a reader will be distracted by the readable<br /> content of a page when looking at its layout. </p>
                </div>
                <img src="assets/images/png-img/real-time-analytics.png" alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Signup;
























