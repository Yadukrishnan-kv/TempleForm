import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./PaymentFailed.css"

const PaymentFailed = () => {
  const navigate = useNavigate()
  const [errorCode] = useState(`ERR${Math.floor(Math.random() * 10000)}`)

  return (
    <div className="payment-failed-container">
      <div className="payment-failed-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="payment-card">
        <div className="error-icon">
          <div className="error-x">
            <span className="error-line line-left"></span>
            <span className="error-line line-right"></span>
          </div>
          <div className="error-circle"></div>
        </div>

        <h2 className="payment-title">Payment Failed</h2>
        <div className="payment-details">
          <p className="payment-message">We couldn't process your payment. Your account has not been charged.</p>
          <div className="divider"></div>
          <div className="error-details">
            <span>Error Code:</span>
            <span className="error-code">{errorCode}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate("/checkout")} className="retry-button">
            <span>Try Again</span>
          </button>
          <button onClick={() => navigate("/")} className="home-button">
            <span>Return to Home</span>
          </button>
        </div>

        <div className="additional-links">
          <a href="/support" className="text-link">
            Contact Support
          </a>
          <span className="separator">•</span>
          <a href="/faq" className="text-link">
            Payment FAQ
          </a>
        </div>

        <div className="common-issues">
          <h3>Common Issues:</h3>
          <ul>
            <li>Insufficient funds in your account</li>
            <li>Incorrect card information</li>
            <li>Transaction declined by your bank</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed