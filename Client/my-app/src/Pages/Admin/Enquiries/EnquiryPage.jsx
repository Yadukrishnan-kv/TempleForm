import { useState, useEffect } from 'react'
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './EnquiryPage.css'

 function EnquiryPage() {
  const [enquiries, setEnquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(`${ip}/api/ContactUs/enquiries`)
        if (!response.ok) {
          throw new Error('Failed to fetch enquiries')
        }
        const data = await response.json()
        setEnquiries(data)
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchEnquiries()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>
  }

  return (
    <div className="app-container">
    <Header />
    <div className="content-container">
      <Sidebar />
      <div className="enquiry-container">
      <div className="enquiry-header">
        <h1 className="enquiry-title">Enquiries</h1>
        <p className="enquiry-subtitle">View all submitted enquiries</p>
      </div>

      <div className="enquirytable-container">
        <table className="enquiry-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Comments</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id}>
                <td>{enquiry.fullName}</td>
                <td>{enquiry.email}</td>
                <td>{enquiry.phone}</td>
                <td>
                  {enquiry.comments}
                </td>
                <td className="date-cell">
                  {new Date(enquiry.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  </div>
  )
}

export default EnquiryPage;
