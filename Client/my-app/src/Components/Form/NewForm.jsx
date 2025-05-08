import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import { toast, ToastContainer } from 'react-toastify';
import './NewForm.css';

const NewForm = () => {
  const [formData, setFormData] = useState({
    name: '', address: '', phone: '', pincode: '', role: ''
  });
  const [roles, setRoles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [forms, setForms] = useState([]);
  const [filterRole, setFilterRole] = useState('');

  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    axios.get(`${ip}/api/newForm/getnewrole`)
      .then((res) => setRoles(res.data))
      .catch((err) => console.error('Error fetching roles:', err));

    fetchForms();
  }, []);

  const fetchForms = () => {
    axios.get(`${ip}/api/newForm/getnewform`)
      .then((res) => setForms(res.data))
      .catch((err) => console.error('Error fetching forms:', err));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '', pincode: '', role: '' });
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('phone', formData.phone);
    data.append('pincode', formData.pincode);
    data.append('role', formData.role);
    data.append('image', selectedFile);

    try {
      await axios.post(`${ip}/api/newForm/createnewform`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Form submitted successfully!');
      resetForm();
      fetchForms();
    } catch (error) {
      toast.error('Form submission failed. Please try again.');
      console.error('Submission error:', error);
    }
  };

  const filteredForms = filterRole
    ? forms.filter((form) => form.role === filterRole)
    : forms;

  return (
    <div>
      <Navbar />
      <div className="container my-4">
  <div className="NewForm-flex-end">
    <button
      className="NewForm-btn-custom NewForm-mb-3"
      onClick={() => setShowForm(!showForm)}
    >
      Registration (രജിസ്ട്രേഷൻ)
    </button>
  </div>

  {showForm && (
    <div className="NewForm-form-card">
      <h2 className="NewForm-form-title">Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="images"
          onChange={handleFileChange}
          className="NewForm-input"
          style={{marginBottom:  "10px"}}

        />
       
        <div className="NewForm-form-group">
          <label className="NewForm-form-label">
            Name <span className="malayalam-text">(പേര്)</span>
          </label>
          <input
            type="text"
            className="NewForm-input"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="NewForm-form-group">
          <label className="NewForm-form-label">
            Address <span className="malayalam-text">(മേൽവിലാസം)</span>
          </label>
          <textarea
            className="NewForm-input"
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="NewForm-form-group">
          <label className="NewForm-form-label">
            Phone <span className="malayalam-text">(ഫോൺ നമ്പർ)</span>
          </label>
          <input
            type="tel"
            className="NewForm-input"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="NewForm-form-group">
          <label className="NewForm-form-label">
            Pincode <span className="malayalam-text">(പിൻകോട്)</span>
          </label>
          <input
            type="text"
            className="NewForm-input"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>

        <div className="NewForm-form-group">
          <label className="NewForm-form-label">Role</label>
          <select
            className="NewForm-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select a Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="NewForm-btn-custom">
          Submit <span className="malayalam-text">(സമർപ്പിക്കുക)</span>
        </button>
      </form>
    </div>
  )}

  <div className="NewForm-flex-between">
    <button className="NewForm-btn-info" onClick={() => setFilterRole('')}>
      Show All
    </button>

    <select
      className="NewForm-select NewForm-select-auto"
      value={filterRole}
      onChange={(e) => setFilterRole(e.target.value)}
    >
      <option value="">Filter by Role</option>
      {roles.map((role) => (
        <option key={role._id} value={role.name}>
          {role.name}
        </option>
      ))}
    </select>
  </div>

  <div className="NewForm-cards-container">
    {filteredForms.map((form, index) => (
      <div key={index} className="NewForm-card">
        {form.image && form.image.path && (
          <img
            src={`${ip}/${form.image.path}`}
            alt="user"
            className="NewForm-card-image"
          />
        )}
        <div className="NewForm-card-content">
          <h6 className="NewForm-card-name">{form.name}</h6>
          <p className="NewForm-card-text">
            <strong>📍 Address:</strong> {form.address}
          </p>
          <p className="NewForm-card-text">
            <strong>👤 Role:</strong> {form.role}
          </p>
          <p className="NewForm-card-text">
            <strong>📞 Phone:</strong> {form.phone}
          </p>
          <p className="NewForm-card-text">
            <strong>🏷️ Pincode:</strong> {form.pincode}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewForm;
