import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './BookingsPage.css'

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ip = process.env.REACT_APP_BACKEND_IP;


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${ip}/api/Bookings/Bookings`);
        setBookings(response.data);
        setIsLoading(false);
      } catch (error) {
        setError('Error fetching bookings');
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="app-container">
    <Header />
    <div className="content-container">
      <Sidebar />
      <div className="booking-container">
      <h1 className="booking-title">Submitted Bookings</h1>
      
      <div className="table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Comment</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.fullName}</td>
                <td>{booking.email}</td>
                <td>{booking.comment}</td>
                <td>{new Date(booking.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default BookingsPage;

