import React from 'react'
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
function SubscriptionPayment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [subscriptions, setSubscriptions] = useState([])
  const [temple, setTemple] = useState(null)
  const ip = process.env.REACT_APP_BACKEND_IP

  useEffect(() => {
    const fetchTempleDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/signin")
          return
        }

        const response = await axios.get(`${ip}/api/temples/details`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data) {
          setTemple(response.data)
        } else {
          setError("No temple details found")
        }

       
      } catch (err) {
        console.error("Error fetching temple details:", err)
        if (err.response && err.response.status === 404) {
          setError("Temple details not found. Please ensure you have registered your temple.")
        } else if (err.response && err.response.status === 401) {
          setError("Authentication failed. Please log in again.")
          navigate("/signin")
        } else {
          setError(`Failed to fetch temple details: ${err.response?.data?.message || err.message}`)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTempleDetails()
  }, [navigate])

  const handleSubscribe = async () => {
    setLoading(true)
    setError("")

    try {
      if (!temple) {
        throw new Error("Temple information not available")
      }

      // Create order on the backend
      const response = await axios.post(`${ip}/api/payments/create-payment`, {
        userId: temple._id,
        orderId: `ORDER_${Date.now()}`,
        templeDetails: {
          templeName: temple._id, // Using temple ID as required by the schema
          email: temple._id,
          phone: temple._id,
          amount: 1000,
          gst: 180,
          totalAmount: 1180,
        },
      })

      // Redirect to Omniware payment page
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl
      } else {
        setError("Failed to initiate payment. Please try again.")
      }
    } catch (error) {
      console.error("Payment initiation error:", error)
      setError(error.response?.data?.message || "Failed to initiate payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`${ip}/api/payments/${orderId}/invoice`, {
        responseType: "blob",
      })

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `invoice-${orderId}.pdf`
      document.body.appendChild(link)
      link.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error downloading invoice:", err)
      alert("Failed to download invoice. Please try again later.")
    }
  }

  // Check if subscription is active
  const isSubscriptionActive = (endDate) => {
    return new Date(endDate) > new Date()
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Temple Subscription Management</h1>

      {/* {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>} */}

      {temple ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Temple Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Temple Name:</p>
              <p className="font-medium">{temple.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{temple.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone:</p>
              <p className="font-medium">{temple.phone}</p>
            </div>
            <div>
              <p className="text-gray-600">Address:</p>
              <p className="font-medium">{temple.address}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Subscription Details</h3>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <div className="flex justify-between mb-1">
                <span>Subscription Amount:</span>
                <span>₹1000.00</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>GST (18%):</span>
                <span>₹180.00</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>₹1180.00</span>
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full md:w-auto"
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading temple information...</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription History</h2>

        {subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">Start Date</th>
                  <th className="py-3 px-6 text-left">End Date</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.orderId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <span className="font-medium">{subscription.orderId}</span>
                    </td>
                    <td className="py-3 px-6 text-left">{formatDate(subscription.startDate)}</td>
                    <td className="py-3 px-6 text-left">{formatDate(subscription.endDate)}</td>
                    <td className="py-3 px-6 text-left">₹{subscription.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          subscription.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : subscription.paymentStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subscription.paymentStatus}
                      </span>
                      {subscription.paymentStatus === "Paid" && (
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            isSubscriptionActive(subscription.endDate)
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {isSubscriptionActive(subscription.endDate) ? "Active" : "Expired"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {subscription.paymentStatus === "Paid" && (
                        <button
                          onClick={() => handleDownloadInvoice(subscription.orderId)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-xs"
                        >
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No subscription history found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionPayment