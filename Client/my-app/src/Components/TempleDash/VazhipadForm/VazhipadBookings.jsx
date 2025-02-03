import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "./VazhipadBookings.css" // Import the CSS file

const VazhipadBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { templeId } = useParams()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_IP}/api/VazhipadBooking/vazhipad-bookings/${templeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setBookings(response.data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error(error.response?.data?.message || "Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_IP}/api/VazhipadBooking/update-status/${bookingId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success("Booking status updated successfully")
      fetchBookings()
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast.error(error.response?.data?.message || "Failed to update booking status")
    }
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-warning",
      completed: "bg-success",
      cancelled: "bg-danger",
    }

    return (
      <span className={`badge ${statusColors[status]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(bookings.length / itemsPerPage)

  if (loading) {
    return (
      <div className="app-containervazhipad ">
        <div className="content-container">
          <div className="Statesubmission-page">
            <div className="d-flex justify-content-center align-items-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="content-container">
        <div className="Statesubmission-page">
          <h2>Temple Bookings</h2>

          {bookings.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="state-table">
                  <thead>
                    <tr>
                      <th>Booking Date</th>
                      <th>User</th>
                      <th>Vazhipads</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                        <td>
                          <strong>{booking.user.fullName}</strong>
                          <br />
                          <small className="text-muted">{booking.user.email}</small>
                        </td>
                        <td>
                          <ul className="list-unstyled m-0">
                            {booking.vazhipads.map((v, index) => (
                              <li key={index}>
                                {v.vazhipadName} ({v.entries.length} entries)
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>₹{booking.totalAmount}</td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>
                          <select
                            className="form-select"
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="state-form">
              <p className="text-center">No bookings found for this temple</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VazhipadBookings

