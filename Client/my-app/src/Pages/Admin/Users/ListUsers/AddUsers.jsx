import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddUsers.css';
import Sidebar from '../../Sidebar/Sidebar';
import Header from '../../Header/Header';


function AddUsers() {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone:''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      let response;
      if (editingUser) {
        response = await axios.put(`${ip}/api/adminlogin/editSubadmin/${editingUser._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        logAction('Update', `Updated User: ${formData}`);

        toast.success("Subadmin updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        response = await axios.post(`${ip}/api/adminlogin/addSubadmin`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await logAction('Create', `Created new User: ${formData}`);

        toast.success("Subadmin added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setFormData({ name: '', email: '', password: '', role: '', phone:'' });
      setEditingUser(null);
      setIsFormVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error managing subadmin:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Error managing subadmin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role, phone: user.phone });
    setIsFormVisible(true);
  };

  const handleDelete = async (id,formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${ip}/api/adminlogin/deleteSubadmin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await logAction('Delete', `Deleted state: ${formData}`);

      toast.success("Subadmin deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting subadmin:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || 'Error deleting subadmin. Please try again.');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${ip}/api/adminlogin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched users:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      setError('Error fetching users. Please try again.');
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${ip}/api/adminlogin/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error.response ? error.response.data : error.message);
      setError('Error fetching roles. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);
  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'Users',
          subModule: 'List Users',
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
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="add-users-page">
          <h2>Manage Subadmins</h2>
          <button className="add-button" onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: '',phone:'' });
          }}>
            {isFormVisible ? "Cancel" : "Add Subadmin"}
          </button>

          {isFormVisible && (
            <div className="add-subadmin-container">
              <h2 className="add-subadmin-title">{editingUser ? "Edit Subadmin" : "Add Subadmin"}</h2>
              <form className="add-subadmin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password {editingUser && "(Leave blank to keep current password)"}</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUser}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="add-subadmin-button" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : (editingUser ? 'Update' : 'Submit')}
                </button>
              </form>
              {error && <div className="error-message">{error}</div>}
            </div>
          )}

          <div className="user-list-container">
            <h2 className="user-list-title">Subadmins</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>phone</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => user.role !== 'admin').map(user => (
                    <tr key={user._id} className="user-item">
                      <td className="user-name">{user.name}</td>
                                            <td className="user-email">{user.phone}</td>

                      <td className="user-email">{user.email}</td>
                      <td className="user-role">{user.role}</td>
                      <td>
                        <button className="edit-link" onClick={() => handleEdit(user)}>Edit</button>
                      </td>
                      <td>
                        <button className="delete-button1" onClick={() => handleDelete(user._id,user.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUsers;

