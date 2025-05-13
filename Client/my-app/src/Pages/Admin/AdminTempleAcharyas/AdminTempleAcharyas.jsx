import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import '../NewForm/NewForms.css'; 
import { toast } from 'react-toastify';

const AdminTempleAcharyas = () => {
  const [forms, setForms] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingRoleName, setEditingRoleName] = useState('');

  const ip = process.env.REACT_APP_BACKEND_IP;

const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'templeAcharyas',
          subModule: 'Manage Role',
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

  const fetchForms = () => {
    axios.get(`${ip}/api/TempleAcharyas/getnewform`)
      .then((res) => setForms(res.data))
      .catch((err) => console.error('Error fetching forms:', err));
  };

  const fetchRoles = () => {
    axios.get(`${ip}/api/TempleAcharyas/getTempleAcharyasrole`)
      .then((res) => setRoles(res.data))
      .catch((err) => console.error('Error fetching roles:', err));
  };

  useEffect(() => {
    fetchForms();
    fetchRoles();
  }, []);

  const handleAddRole = (e) => {
    e.preventDefault();
    axios.post(`${ip}/api/TempleAcharyas/createTempleAcharyasrole`, { name: newRole })
      .then(() => {
        toast.success('Role added successfully');
        setNewRole('');
        setIsFormVisible(false);
        fetchRoles();
      })
      .catch((err) => {
        console.error('Error adding role:', err);
        toast.error('Error adding role');
      });
  };

  const handleEditRole = (role) => {
    setEditingRoleId(role._id);
    setEditingRoleName(role.name);
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();
    axios.put(`${ip}/api/TempleAcharyas/editTempleAcharyasrole/${editingRoleId}`, { name: editingRoleName })
      .then(() => {
        toast.success('Role updated successfully');
         logAction('Update', `Updated Data: ${editingRoleName}`);    

        setEditingRoleId(null);
        setEditingRoleName('');
        fetchRoles();
      })
      .catch((err) => {
        console.error('Error updating role:', err);
        toast.error('Error updating role');
      });
  };

  const handleDeleteRole = (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      axios.delete(`${ip}/api/TempleAcharyas/deleteTempleAcharyasrole/${id}`)
        .then(() => {
          toast.success('Role deleted successfully');
          fetchRoles();
           logAction('Delete', `Deleted Data: ${newRole}`);

        })
        .catch((err) => {
          console.error('Error deleting role:', err);
          toast.error('Error deleting role');
        });
    }
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    setNewRole('');
  };

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="newform-page">
          <h2>Manage Role for TempleAcharyas</h2>
          <button className="add-button" onClick={toggleForm}>
            {isFormVisible ? "Cancel" : "Add New Role"}
          </button>

          {isFormVisible && (
            <form className="role-form" onSubmit={handleAddRole}>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Enter Role Name"
                required
              />
              <button type="submit">Submit</button>
            </form>
          )}

          <div className="role-list">
            <h3>Available Roles</h3>

            <table className="state-table">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role._id}>
                    <td>
                      {editingRoleId === role._id ? (
                        <form onSubmit={handleUpdateRole} style={{ display: 'flex', gap: '5px' }}>
                          <input
                            type="text"
                            value={editingRoleName}
                            onChange={(e) => setEditingRoleName(e.target.value)}
                            required
                          />
                          <button type="submit" className="delete-button1">Save</button>
                          <button type="button" className="cancel-button" onClick={() => setEditingRoleId(null)}>Cancel</button>
                        </form>
                      ) : (
                        role.name
                      )}
                    </td>
                    <td>
                      {editingRoleId !== role._id && (
                        <button
                          className="edit-link"
                          onClick={() => handleEditRole(role)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className="delete-button1"
                        onClick={() => handleDeleteRole(role._id)}
                      >
                        Delete
                      </button>
                    </td>
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

export default AdminTempleAcharyas;
