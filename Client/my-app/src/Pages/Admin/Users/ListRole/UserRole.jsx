import './Role.css';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserRole() {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const ip = process.env.REACT_APP_BACKEND_IP;


  // Function to log actions
  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'Users',
          subModule: 'Role',
          details
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };
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

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${ip}/api/adminlogin/roles-permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter out admin role and null values
      const filteredRoles = response.data.filter(role => {
        return role && role._id && typeof role._id === 'string' && role._id.toLowerCase() !== 'admin';
      });
      
      setRoles(filteredRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Error fetching roles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchRoles();
  }, []);

  const handlePermissionChange = async (role, updatedPermissions) => {
    try {
      if (currentUser?.role !== 'admin') {
        setError('Only administrators can modify permissions');
        return;
      }
  
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${ip}/api/adminlogin/updateRolePermissions`,
        {
          role,
          menuPermissions: updatedPermissions, // Send all updated permissions at once
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.menuPermissions) {
        setRoles(roles.map(r => {
          if (r._id === role) {
            return {
              ...r,
              menuPermissions: response.data.menuPermissions,
            };
          }
          return r;
        }));
        await logAction('Update', `Update  role: ${role}`);

        setSuccessMessage('Permissions updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      setError(error.response?.data?.message || 'Error updating permissions. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };
  const handleCheckboxChange = (roleId, permission, checked) => {
    const updatedRoles = roles.map(role => {
      if (role._id === roleId) {
        return {
          ...role,
          menuPermissions: {
            ...role.menuPermissions,
            [permission]: checked,
          },
        };
      }
      return role;
    });
   
    setRoles(updatedRoles);
  
    // Send updated permissions to the backend
    const updatedPermissions = updatedRoles.find(role => role._id === roleId).menuPermissions;
    handlePermissionChange(roleId, updatedPermissions);
  };
    
  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="content-container">
          <Sidebar />
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

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
          <h2>Role Management</h2>
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <div className="user-role-table">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Dashboard</th>
                  <th>Users</th>
                  <th>Registration</th>
                  <th>Log</th>
                  <th>Master</th>
                  <th>Blog Page</th>
                  <th>Enquiry</th>
                  <th>Bookings</th>
                </tr>
              </thead>
              <tbody>
  {roles.map(role => (
    <tr key={role._id}>
      <td>{role._id}</td>
      {['dashboard', 'users', 'registration','log', 'master', 'blogPage', 'enquiry', 'bookings'].map(permission => (
        <td key={permission}>
          <input
            type="checkbox"
            checked={role.menuPermissions?.[permission] || false}
            onChange={(e) => handleCheckboxChange(role._id, permission, e.target.checked)}
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
  );
}

export default UserRole;

