import React, { useState } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

function ForgotPassword() {
   const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const togglePasswordVisibility1 = () => {
      setshowConfirmPassword(!showConfirmPassword);
    };
  return (
    <div>
      <Navbar/>
     <div className="p-3 p-sm-5">
  <div className="row g-4 g-xl-5 justify-content-between align-items-center">
    <div className="col-xl-5 d-flex justify-content-center">
      <div className="authentication-wrap overflow-hidden position-relative text-center text-sm-start my-5">
        {/* Start Header Text */}
        <div className="mb-5">
          <h2 className="display-6 fw-semibold mb-3">Password <span className="font-caveat text-primary">Reset</span></h2>
          <p className="mb-0">Fill with your mail to receive instructions on how to reset your password.</p>
        </div>
        {/* /.End Header Text */}
        <form className="register-form">
          {/* Start Form Group */}
          <div className="Signup-form-group mb-4">
            <label className="required">Enter Email</label>
            <input type="email" className="form-control" />
          </div>
          {/* /.End Form Group */}
          {/* Start Form Group */}
          <div className="Signup-form-group mb-4">
            <label className="required">Password</label>
            <input id="password" type={showPassword ? 'text' : 'password'} className="form-control password" autoComplete="off" />
            <i data-bs-toggle="#password" className="fa-regular fa-eye-slash toggle-password ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`" onClick={togglePasswordVisibility} />
          </div>
          {/* /.End Form Group */}
          {/* Start Form Group */}
          <div className="Signup-form-group mb-4">
            <label className="required">Confirm Password</label>
            <input id="confirmPassword"  type={showConfirmPassword ? 'text' : 'password'} className="form-control c-password" autoComplete="off" />
            <i data-bs-toggle="#confirmPassword" className="fa-regular fa-eye-slash toggle-password ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`" onClick={togglePasswordVisibility1}
            />
          </div>
          {/* /.End Form Group */}
          {/* Start Button */}
          <button type="submit" className="btn btn-primary btn-lg w-100">Reset Password</button>
          {/* End Button */}
        </form>
        {/* Start Bottom Text */}
        <div className="bottom-text text-center mt-4">Remember your password? <Link to={'/signin'}  className="fw-medium text-decoration-underline text-dark">Log in</Link> </div>
        {/* /.End Bottom Text */}
      </div>
    </div>
    <div className="col-xl-7 d-none d-xl-block">
      <div className="background-image bg-light d-flex flex-column h-100 justify-content-center p-5 rounded-4" data-image-src="assets/images/lines.svg">
        <div className="py-5 text-center">
          <div className="mb-5">
            <h2 className="fw-semibold">Effortlessly organize your<br /> workspace with ease.</h2>
            <p>It is a long established fact that a reader will be distracted by the readable<br /> content of a page when looking at its layout. </p>
          </div>
          <img src="assets/images/png-img/forgot-password.png" alt className="img-fluid" />
        </div>
      </div>
    </div>
  </div>
</div>

      <Footer/>

    </div>
  )
}

export default ForgotPassword