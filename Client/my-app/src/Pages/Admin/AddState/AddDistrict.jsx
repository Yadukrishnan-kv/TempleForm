import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import './AddState.css'; // Same CSS file for consistency

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
  const itemsPerPage = 5; // Number of items to display per page

  // Fetch all districts
  useEffect(() => {
    axios.get(`${ip}/api/districts/getAllDistricts`)
      .then(response => setDistricts(response.data))
      .catch(error => console.error(error));
  }, [ip]);

  

  useEffect(() => {
    axios.get(`${ip}/api/states/getAllStates`)
      .then(response => {
        console.log("States fetched successfully:", response.data);
        // Access the `states` property of the response
        setStates(response.data.states);
      })
      .catch(error => console.error("Error fetching states:", error));
  }, [ip]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedState = states.find(s => s._id === state);
    if (!selectedState) {
      console.error("Selected state is invalid.");
      return;
    }
  
    const payload = { name, state };
    console.log("Submitting payload:", payload);
  
    if (isEditing) {
      axios.put(`${ip}/api/districts/updateDistrict/${currentDistrictId}`, payload)
        .then(() => {
          console.log("District updated successfully.");
          setDistricts(districts.map(district =>
            district._id === currentDistrictId ? { ...district, name, state: selectedState } : district
          ));
          resetForm();
        })
        .catch(error => console.error("Error updating district:", error));
    } else {
      axios.post(`${ip}/api/districts/createDistrict`, payload)
        .then(response => {
          console.log("District created successfully:", response.data);
          setDistricts([...districts, { ...response.data, state: selectedState }]);
          resetForm();
        })
        .catch(error => console.error("Error creating district:", error));
    }
  };
  

  const handleDelete = (id) => {
    axios.delete(`${ip}/api/districts/deleteDistrict/${id}`)
      .then(() => {
        setDistricts(districts.filter(district => district._id !== id));
      })
      .catch(error => console.error(error));
  };

  const handleEdit = (district) => {
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
    setIsFormVisible(false);
    setCurrentDistrictId(null);
  };

  // Pagination logic: slice the districts array for the current page
  const indexOfLastDistrict = currentPage * itemsPerPage;
  const indexOfFirstDistrict = indexOfLastDistrict - itemsPerPage;
  const currentDistricts = districts.slice(indexOfFirstDistrict, indexOfLastDistrict);

  const totalPages = Math.ceil(districts.length / itemsPerPage); // Total pages

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="Statesubmission-page">
          <h2>Manage Districts</h2>
          <button className="add-button" onClick={() => {
            setIsFormVisible(!isFormVisible);
            resetForm();
          }}>
            {isFormVisible ? "Cancel" : isEditing ? "Edit District" : "Add New District"}
          </button>

          {/* Add/Edit District Form */}
          {isFormVisible && (
            <form className="state-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="District Name"
                required
              />
              <select value={state} onChange={(e) => setState(e.target.value)} required>
                <option value="">Select State</option>
                {Array.isArray(states) &&
    states.map(state => (
      <option key={state._id} value={state._id}>
        {state.name}
      </option>
    ))}
              </select>
              <button type="submit">{isEditing ? "Update District" : "Add District"}</button>
            </form>
          )}

          {/* District List */}
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
                    <td>{district.state.name}</td>
                    <td>{district.name}</td>
                    <td>
                      <button
                        className="edit-link"
                        onClick={() => handleEdit(district)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(district._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDistrict;
