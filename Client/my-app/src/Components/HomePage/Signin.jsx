import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { toast } from "react-toastify"
import axios from "axios"

function Signin() {
  const ip = process.env.REACT_APP_BACKEND_IP

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await axios.post(`${ip}/api/UserRoutes/loginUser`, formData)

      const { token, user } = response.data

      // Store auth data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Check for pending booking
      const pendingBooking = JSON.parse(sessionStorage.getItem("pendingBooking"))

      if (pendingBooking && pendingBooking.returnUrl) {
        // Clear the pending booking
        sessionStorage.removeItem("pendingBooking")
        // Navigate back to the booking page
        navigate(pendingBooking.returnUrl)
      } else {
        // Regular role-based navigation
        if (user.role === "1") {
          navigate("/userdashboard")
        } else if (user.role === "2") {
          navigate("/TempleDashboard")
        } else {
          throw new Error("Invalid user role")
        }
      }

      toast.success("Login successful!")
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
      toast.error("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Navbar />

      <div className="p-3 p-sm-5">
        <div className="row g-4 g-xl-5 justify-content-between">
          <div className="col-xl-5 d-flex justify-content-center">
            <div className="authentication-wrap overflow-hidden position-relative text-center text-sm-start my-5">
              <div className="mb-5">
                <h2 className="display-6 fw-semibold mb-3">
                  Welcome back! Please <span className="font-caveat text-primary">Sign in</span> to continue.
                </h2>
                <p className="mb-0">
                  Unlock a world of exclusive content, enjoy special offers, and be the first to dive into exciting news
                  and updates by joining our community!
                </p>
              </div>
              <div className="d-grid gap-3 mb-3">
                <a
                  className="align-items-center btn btn-dark btn-lg d-flex linkedin-btn position-relative text-start"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    fill="currentColor"
                    className="bi bi-apple"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Z" />
                  </svg>
                  <span className="ms-3">Sign up with Apple</span>
                </a>
                <a
                  className="align-items-center btn btn-lg btn-light d-flex google-btn position-relative text-start"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    fill="currentColor"
                    className="bi bi-google"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                  </svg>
                  <span className="ms-3">Sign up with Google</span>
                </a>
              </div>
              <p className="mb-0">
                We won't post anything without your permission and your personal details are kept private
              </p>
              <div className="align-items-center d-flex my-5">
                <hr className="flex-grow-1 m-0" /> <span className="fs-16 fw-bold px-3 text-dark">Or</span>
                <hr className="flex-grow-1 m-0" />
              </div>
              <form className="register-form" onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="Signup-form-group mb-4">
                  <label className="required">Enter Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback text-start">Enter your valid email</div>
                </div>
                <div className="Signup-form-group mb-4">
                  <label className="required">Password</label>
                  <div className="position-relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control password"
                      autoComplete="off"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <i
                      className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"} toggle-password position-absolute end-0 top-50 translate-middle-y me-3`}
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
                <div className="form-check mb-4 text-start">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me next time
                  </label>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
              <div className="bottom-text text-center mt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="fw-medium text-decoration-underline text-dark">
                  Sign Up
                </Link>
                <br />
                <Link to="/forgot-password" className="fw-medium text-decoration-underline text-dark">
                  Forgot Password?
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
                <img src="assets/images/png-img/login.png" alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Signin

