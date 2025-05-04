import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewForm = () => {
  const [formData, setFormData] = useState({
    name: '', address: '', phone: '', pincode: '', role: ''
  });
  const [roles, setRoles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    axios.get(`${ip}/api/newForm/getnewrole`)
      .then((res) => setRoles(res.data))
      .catch((err) => console.error('Error fetching roles:', err));
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '', address: '', phone: '', pincode: '', role: ''
    });
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
    } catch (error) {
      toast.error('Form submission failed. Please try again.');
      console.error('Submission error:', error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="form-container">
        <h2 className="form-title">Form</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="file" name="images" onChange={handleFileChange} />

          <div>
            <label className="form-label">
              Name <span className="malayalam-text">(പേര്)</span>
            </label>
            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label">
              Address <span className="malayalam-text">( മേൽവിലാസം)</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label className="form-label">
              Phone Number <span className="malayalam-text">(ഫോൺ നമ്പർ)</span>
            </label>
            <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label">
              Pincode <span className="malayalam-text">(പിൻകോട്)</span>
            </label>
            <input type="text" className="form-input" name="pincode" value={formData.pincode} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label">Role</label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select a Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="form-submit">
            Submit <span className="malayalam-text">(സമർപ്പിക്കുക)</span>
          </button>
        </form>
      </div>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewForm;

