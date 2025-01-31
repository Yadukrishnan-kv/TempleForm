import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { toast } from "react-toastify";

function ForgotPassword() {

  const ip = process.env.REACT_APP_BACKEND_IP;

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate();


  const handleSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${ip}/api/UserRoutes/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setStep(2)
        setError("")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to send OTP")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${ip}/api/UserRoutes/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      if (response.ok) {
        setStep(3)
        setError("")
      } else {
        const data = await response.json()
        setError(data.message || "Invalid OTP")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      const response = await fetch(`${ip}/api/UserRoutes/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      if (response.ok) {
        toast.success("Password Changed Successfully.!");
        navigate('/Signin');
        // Redirect to login page or show success message
        setError("")
        // You can add redirection logic here
      } else {
        const data = await response.json()
        setError(data.message || "Failed to reset password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div>
      <Navbar />
      <div className="p-3 p-sm-5">
        <div className="row g-4 g-xl-5 justify-content-between align-items-center">
          <div className="col-xl-5 d-flex justify-content-center">
            <div className="authentication-wrap overflow-hidden position-relative text-center text-sm-start my-5">
              <div className="mb-5">
                <h2 className="display-6 fw-semibold mb-3">
                  Password <span className="font-caveat text-primary">Reset</span>
                </h2>
                <p className="mb-0">
                  {step === 1 && "Fill with your email to receive instructions on how to reset your password."}
                  {step === 2 && "Enter the OTP sent to your email."}
                  {step === 3 && "Enter your new password."}
                </p>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {step === 1 && (
                <form onSubmit={handleSubmitEmail}>
                  <div className="Signup-form-group mb-4">
                    <label className="required">Enter Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Send OTP
                  </button>
                </form>
              )}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp}>
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
                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Verify OTP
                  </button>
                </form>
              )}
              {step === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div className="Signup-form-group mb-4">
                    <label className="required">New Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <i
                        className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"} toggle-password position-absolute end-0 top-50 translate-middle-y me-3`}
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                  </div>
                  <div className="Signup-form-group mb-4">
                    <label className="required">Confirm New Password</label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <i
                        className={`fa-regular ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} toggle-password position-absolute end-0 top-50 translate-middle-y me-3`}
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Reset Password
                  </button>
                </form>
              )}
              <div className="bottom-text text-center mt-4">
                Remember your password?{" "}
                <Link to="/signin" className="fw-medium text-decoration-underline text-dark">
                  Log in
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-7 d-none d-xl-block">
            <div
              className="background-image bg-light d-flex flex-column h-100 justify-content-center p-5 rounded-4"
              data-image-src="assets/images/lines.svg"
            >
              <div className="py-5 text-center">
                <div className="mb-5">
                  <h2 className="fw-semibold">
                    Effortlessly organize your
                    <br /> workspace with ease.
                  </h2>
                  <p>
                    It is a long established fact that a reader will be distracted by the readable
                    <br /> content of a page when looking at its layout.{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ForgotPassword

