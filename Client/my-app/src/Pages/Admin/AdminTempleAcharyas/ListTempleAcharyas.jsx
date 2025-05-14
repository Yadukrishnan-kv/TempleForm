import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

function ListTempleAcharyas() {
  const [forms, setForms] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editFormId, setEditFormId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    pincode: '',
    role: '',
    image: null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const ip = process.env.REACT_APP_BACKEND_IP;

  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'templeAcharyas',
          subModule: 'Manage templeAcharyas',
          details,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  const fetchForms = () => {
    axios
      .get(`${ip}/api/TempleAcharyas/getTempleAcharyas`)
      .then((res) => setForms(res.data))
      .catch((err) => console.error('Error fetching forms:', err));
  };

  const fetchRoles = () => {
    axios
      .get(`${ip}/api/TempleAcharyas/getTempleAcharyasrole`)
      .then((res) => setRoles(res.data))
      .catch((err) => console.error('Error fetching roles:', err));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ip}/api/TempleAcharyas/deleteTempleAcharyas/${id}`);
      fetchForms();
      await logAction('Delete', `Deleted Role: ${formData}`);
    } catch (err) {
      console.error('Error deleting form:', err);
    }
  };
  
  const handleEdit = (form) => {
    setEditFormId(form._id);
    setFormData({
      name: form.name,
      address: form.address,
      phone: form.phone,
      pincode: form.pincode,
      role: form.role,
      image: null,
    });
  };

  

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('pincode', formData.pincode);
      data.append('role', formData.role);
  
      if (formData.image) {
        data.append('image', formData.image); // file object
      }
  
      await axios.put(`${ip}/api/TempleAcharyas/updateTempleAcharyas/${editFormId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setEditFormId(null);
      await logAction('Update', `Updated Role: ${formData.name}`);
      setFormData({
        name: '',
        address: '',
        phone: '',
        pincode: '',
        role: '',
        image: null,
      });
      fetchForms();
    } catch (err) {
      console.error('Error updating form:', err);
    }
  };
  

  useEffect(() => {
    fetchForms();
    fetchRoles();
  }, []);

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.phone.includes(searchTerm) ||
      form.pincode.includes(searchTerm);

    const matchesRole = selectedRole ? form.role === selectedRole : true;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="newform-page">
          <div className="form-list">
            <h2>Form List</h2>

            {/* Search and Filter */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, phone or pincode"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <table className="state-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Pincode</th>
                  <th>Role</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredForms.map((form) => (
                  <tr key={form._id}>
<td>
{form.image &&  (
  <img src={`${ip}/${form.image.path}`} alt={form.name} width="50" height="50" />
)}

</td>
                    <td>{form.name}</td>
                    <td>{form.address}</td>
                    <td>{form.phone}</td>
                    <td>{form.pincode}</td>
                    <td>{form.role}</td>
                    <td>
                      <button className="edit-link" onClick={() => handleEdit(form)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="delete-button1" onClick={() => handleDelete(form._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editFormId && (
            <div className="edit-newform-container">
              <h3 className="edit-newformform-title">Edit Form</h3>
              <input
  type="file"
  onChange={(e) =>
    setFormData({ ...formData, image: e.target.files[0] })
  }
/>

              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="edit-newform-input"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="edit-newform-input"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="edit-newform-input"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="edit-newform-input"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="edit-newform-select"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              <button className="edit-newform-update-button" onClick={handleUpdate}>
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListTempleAcharyas;

