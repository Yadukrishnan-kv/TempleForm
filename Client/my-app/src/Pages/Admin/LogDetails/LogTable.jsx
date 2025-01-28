import React, { useState, useEffect } from 'react';
import './LogTable.css';

function LogTable() {
  const [logs, setLogs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const ip = process.env.REACT_APP_BACKEND_IP;

  // Fetch admin names when component mounts
  useEffect(() => {
    fetchAdminNames();
  }, []);

  // Fetch logs when filters change
  useEffect(() => {
    if (admins.length > 0) { // Only fetch logs after admins are loaded
      fetchLogs();
    }
  }, [dateRange, selectedUserId, admins]);

  const fetchAdminNames = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${ip}/api/adminlogin/admin-names`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch admin names');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format for admin names');
      }

      setAdmins(data);
    } catch (err) {
      console.error('Error fetching admin names:', err);
      setError(err.message);
    }
  };

  const fetchLogs = async () => {
    try {
      setError(null);
      const queryParams = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        userId: selectedUserId
      }).toString();

      console.log('Fetching logs with params:', queryParams); // Debug log

      const response = await fetch(`${ip}/api/adminlogin/logs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch logs');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format for logs');
      }

      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleCheckbox = (logId) => {
    setSelectedLogs(prev =>
      prev.includes(logId)
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedLogs.length || !window.confirm('Are you sure you want to delete selected logs?')) {
      return;
    }

    try {
      const response = await fetch(`${ip}/api/adminlogin/logs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ logIds: selectedLogs })
      });

      if (!response.ok) {
        throw new Error('Failed to delete logs');
      }

      await fetchLogs();
      setSelectedLogs([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'Create':
        return 'text-green-600';
      case 'Update':
        return 'text-blue-600';
      case 'Delete':
        return 'text-red-600';
      case 'Login':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchLogs();
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button
          onClick={handleRetry}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="filters-container">
        <div className="date-range-container">
        <select
            value={selectedUserId}
            onChange={handleUserChange}
            className="sortselect "
          >
            <option value="all">All Users</option>
            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.name} ({admin.role})
              </option>
            ))}
          </select>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="date-input"
          />
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="date-input"
          />
           
          {selectedLogs.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="logdelete-button"
            disabled={isLoading}
          >
            Delete Selected ({selectedLogs.length})
          </button>
        )}
        </div>

       

        
      </div>

      {logs.length === 0 ? (
        <div className="no-logs-message">
          No logs found for the selected criteria
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setSelectedLogs(e.target.checked ? logs.map(log => log._id) : []);
                    }}
                    checked={selectedLogs.length === logs.length && logs.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLogs.includes(log._id)}
                      onChange={() => handleCheckbox(log._id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.module}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.subModule}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${getActionColor(log.action)}`}>
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LogTable;



