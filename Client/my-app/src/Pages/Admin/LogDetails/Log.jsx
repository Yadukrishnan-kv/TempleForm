import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import LogTable from './LogTable'

function Log() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    startDate: '',
    endDate: ''
  });
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    fetchAdminLogs();
  }, [filters]);

  const fetchAdminLogs = async () => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`${ip}/api/adminlogin/logs?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      setError('Failed to load logs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="log-content p-6">
          {/* <h1 className="text-2xl font-bold mb-6">Admin Activity Logs</h1> */}
          
          {/* <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="border rounded-md p-2"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="subadmin1">Subadmin 1</option>
              <option value="subadmin2">Subadmin 2</option>
              <option value="subadmin3">Subadmin 3</option>
              <option value="subadmin4">Subadmin 4</option>
              <option value="subadmin5">Subadmin 5</option>
            </select>

            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="border rounded-md p-2"
              placeholder="Start Date"
            />

            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="border rounded-md p-2"
              placeholder="End Date"
            />
          </div> */}

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-center p-4">No logs found.</div>
          ) : (
            <LogTable logs={logs} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Log;

