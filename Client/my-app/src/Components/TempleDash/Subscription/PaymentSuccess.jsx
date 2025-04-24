import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./PaymentSuccess.css"

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)
  const [confirmationNumber] = useState(() => `TRX${Math.floor(Math.random() * 1000000)}`)

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/")
    }, 5000)

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(countdownInterval)
    }
  }, [navigate])

  return (
    <div className="payment-success-container">
      <div className="payment-success-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="payment-card">
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>

        <h2 className="payment-title">Payment Successful!</h2>
        <div className="payment-details">
          <p className="payment-message">Thank you for your subscription. Your premium access is now active.</p>
          <div className="divider"></div>
          <div className="confirmation-number">
            <span>Confirmation #:</span>
            <span className="confirmation-value">{confirmationNumber}</span>
          </div>
        </div>

        <div className="redirect-info">
          <div className="countdown-circle">
            <span className="countdown-number">{countdown}</span>
          </div>
          <p>Redirecting to home in {countdown} seconds</p>
        </div>

        <button onClick={() => navigate("/")} className="home-button">
          <span>Return to Home</span>
        </button>

        <div className="additional-links">
          <a href="/account" className="text-link">View Account</a>
          <span className="separator">•</span>
          <a href="/support" className="text-link">Need Help?</a>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess


