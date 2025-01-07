
import './Role.css'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function UserRole() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const ip = process.env.REACT_APP_BACKEND_IP;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Users' },
    { id: 'registration', label: 'Registration' },
    { id: 'master', label: 'Master' },
    { id: 'blogPage', label: 'Blog Page' },
    { id: 'enquiry', label: 'Enquiry' },
    { id: 'bookings', label: 'Bookings' }
  ];

  // Fetch current user profile
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${ip}/api/adminlogin/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      setError('Error fetching user profile.');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${ip}/api/adminlogin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      setError('Error fetching users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const handlePermissionChange = async (userId, menuId, checked) => {
    try {
      if (currentUser?.role !== 'admin') {
        setError('Only administrators can modify permissions');
        return;
      }

      const token = localStorage.getItem('token');
      await axios.put(
        `${ip}/api/adminlogin/updateMenuPermissions`,
        {
          userId,
          menuPermissions: {
            [menuId]: checked
          }
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      setUsers(users.map(user => {
        if (user._id === userId) {
          return {
            ...user,
            menuPermissions: {
              ...user.menuPermissions,
              [menuId]: checked
            }
          };
        }
        return user;
      }));

      setSuccessMessage('Permissions updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating permissions:', error);
      setError(error.response?.data?.message || 'Error updating permissions. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="loading">Loading...</div>
      </div>
    </div>
  );

  if (currentUser?.role !== 'admin') {
    return (
      <div className="app-container">
        <Header />
        <div className="content-container">
          <Sidebar />
          <div className="error-message">Only administrators can access this page.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="app-container">
    <Header />
    <div className="content-container">
      <Sidebar />
      <div className="user-role-container">
        <h2>User Role Management</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="user-role-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {menuItems.map(item => (
                  <th key={item.id}>{item.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  {menuItems.map(item => (
                    <td key={`${user._id}-${item.id}`}>
                      <input
                        type="checkbox"
                        checked={user.menuPermissions?.[item.id] || false}
                        onChange={(e) => handlePermissionChange(user._id, item.id, e.target.checked)}
                        disabled={user.role === 'admin'}
                      />
                    </td>
                  ))}
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

export default UserRole