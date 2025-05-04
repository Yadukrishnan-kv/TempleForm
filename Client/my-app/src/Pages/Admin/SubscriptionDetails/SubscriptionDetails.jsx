import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

const SubscriptionDetails = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`${ip}/api/payments/getallsubscriptions`);
        setSubscriptions(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchSubscriptions();
  }, [ip]);

  useEffect(() => {
    let filteredData = [...subscriptions];

    // Text search
    if (search.trim()) {
      const query = search.toLowerCase();
      filteredData = filteredData.filter(
        (sub) =>
          sub.templeName?.toLowerCase().includes(query) ||
          sub.email?.toLowerCase().includes(query) ||
          sub.number?.toLowerCase().includes(query)
      );
    }

    // Date filter
   // Filter by startDate range
                if (fromDate) {
                    filteredData = filteredData.filter(
                    (sub) => new Date(sub.startDate) >= new Date(fromDate)
                    );
                }
                if (toDate) {
                    filteredData = filteredData.filter(
                    (sub) => new Date(sub.startDate) <= new Date(toDate)
                    );
                }
                

                    setFiltered(filteredData);
                }, [search, fromDate, toDate, subscriptions]);

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="newform-page">
          <div className="form-list">
            <h2>Subscription List</h2>

            {/* Search and Filter Section */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search here "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '8px', width: '250px' }}
              />

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ padding: '8px' }}
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ padding: '8px' }}
              />
            </div>

            <table className="state-table">
              <thead>
                <tr>
                  <th>Temple Name</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Subscription EndDate</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub.templeName}</td>
                      <td>{sub.address}</td>
                      <td>{sub.email}</td>
                      <td>{sub.number}</td>
                      <td>{new Date(sub.endDate).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      No subscriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
