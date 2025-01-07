import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import './AddState.css'; // Using original CSS
import { toast } from 'react-toastify';

function AddDistrict() {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDistrictId, setCurrentDistrictId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Fetch all districts
  const fetchDistricts = async () => {
    try {
      const response = await axios.get(`${ip}/api/districts/getAllDistricts`);
      console.log("Districts fetched:", response.data);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setError('Failed to fetch districts');
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, [ip]);

  // Fetch all states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${ip}/api/states/getAllStates`);
        console.log("States fetched:", response.data);
        setStates(response.data.states || []);
      } catch (error) {
        console.error('Error fetching states:', error);
        setError('Failed to fetch states');
      }
    };
    fetchStates();
  }, [ip]);

  const toggleForm = () => {
    console.log("Toggling form visibility. Current state:", isFormVisible);
    setIsFormVisible(!isFormVisible);
    if (isFormVisible) {
      resetForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { name, state });

    if (!name || !state) {
      console.error("Name and state are required");
      setError("Please fill in all fields");
      return;
    }

    try {
      const payload = { name, state };
      console.log("Sending payload:", payload);

      if (isEditing && currentDistrictId) {
        console.log("Updating district:", currentDistrictId);
        const response = await axios.put(`${ip}/api/districts/updateDistrict/${currentDistrictId}`, payload);
        toast.success("District Updated successfully!")

        console.log("Update response:", response.data);
      } else {
        console.log("Creating new district");
        const response = await axios.post(`${ip}/api/districts/createDistrict`, payload);
        toast.success("District added successfully!")
        console.log("Create response:", response.data);
      }
      
      await fetchDistricts();
      resetForm();
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error submitting district:', error.response?.data || error);
      setError(error.response?.data?.message || 'Failed to submit district');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ip}/api/districts/deleteDistrict/${id}`);
      await fetchDistricts();
      toast.success("District deleted successfully!")

    } catch (error) {
      console.error('Error deleting district:', error);
      toast.error("Error deleting district!")
      setError('Failed to delete district');
    }
  };

  const handleEdit = (district) => {
    console.log("Editing district:", district);
    setIsEditing(true);
    setIsFormVisible(true);
    setName(district.name);
    setState(district.state._id);
    setCurrentDistrictId(district._id);
  };

  const resetForm = () => {
    setName('');
    setState('');
    setIsEditing(false);
    setCurrentDistrictId(null);
    setError(null);
  };

  // Pagination logic
  const indexOfLastDistrict = currentPage * itemsPerPage;
  const indexOfFirstDistrict = indexOfLastDistrict - itemsPerPage;
  const currentDistricts = districts.slice(indexOfFirstDistrict, indexOfLastDistrict);
  const totalPages = Math.max(1, Math.ceil(districts.length / itemsPerPage));

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [districts.length]);

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="Statesubmission-page">
          <h2>Manage Districts</h2>
          
          {/* Changed to use toggleForm function */}
          <button 
            type="button" 
            className="add-button" 
            onClick={toggleForm}
          >
            {isFormVisible ? "Cancel" : "Add New District"}
          </button>

          {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

          {isFormVisible && (
            <form className="state-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="District Name"
                required
              />
              <select 
                value={state} 
                onChange={(e) => setState(e.target.value)} 
                required
              >
                <option value="">Select State</option>
                {Array.isArray(states) && states.map(state => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
              <button type="submit">
                {isEditing ? "Update District" : "Add District"}
              </button>
            </form>
          )}

          <div className="state-list">
            <h2>District List</h2>
            <table className="district-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>District</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentDistricts.map(district => (
                  <tr key={district._id}>
                    <td>{district.state?.name || 'N/A'}</td>
                    <td>{district.name}</td>
                    <td>
                      <button
                        type="button"
                        className="edit-link"
                        onClick={() => handleEdit(district)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-button1"
                        onClick={() => handleDelete(district._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-controls">
              {districts.length > 0 ? (
                <>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </>
              ) : (
                <span>No districts to display</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDistrict;

