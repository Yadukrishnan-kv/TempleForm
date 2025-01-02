import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import './AddState.css';

const AddState = () => {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const [name, setName] = useState('');
  const [states, setStates] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editStateId, setEditStateId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalStates, setTotalStates] = useState(0); // Total number of states
  const [statesPerPage] = useState(5); // Number of states per page

  // Fetch all states with pagination
  useEffect(() => {
    axios.get(`${ip}/api/states/getAllStates?page=${currentPage}&limit=${statesPerPage}`)
      .then(response => {
        setStates(response.data.states);
        setTotalStates(response.data.totalStates); // Total states for pagination
      })
      .catch(error => console.error(error));
  }, [currentPage]); // Re-fetch data when the page changes

  // Handle form submission for adding/updating a state
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editStateId) {
      axios.put(`${ip}/api/states/updateState/${editStateId}`, { name })
        .then(() => {
          setName('');
          setEditStateId(null);
          setIsFormVisible(false);
          refreshStates(); // Reload the states
        })
        .catch(error => console.error(error));
    } else {
      axios.post(`${ip}/api/states/createState`, { name })
        .then(() => {
          setName('');
          setIsFormVisible(false);
          refreshStates();
        })
        .catch(error => console.error(error));
    }
  };

  // Load states
  const refreshStates = () => {
    axios.get(`${ip}/api/states/getAllStates?page=${currentPage}&limit=${statesPerPage}`)
      .then(response => {
        setStates(response.data.states);
        setTotalStates(response.data.totalStates);
      })
      .catch(error => console.error(error));
  };

  // Handle delete state
  const handleDelete = (id) => {
    axios.delete(`${ip}/api/states/deleteState/${id}`)
      .then(() => setStates(states.filter(state => state._id !== id)))
      .catch(error => console.error(error));
  };

  // Handle edit button click
  const handleEdit = (id) => {
    const stateToEdit = states.find(state => state._id === id);
    if (stateToEdit) {
      setName(stateToEdit.name);
      setEditStateId(id);
      setIsFormVisible(true);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalStates / statesPerPage);

  // Handle Previous and Next buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="Statesubmission-page">
          <h2>Manage States</h2>
          <button className="add-button" onClick={() => {
            setIsFormVisible(!isFormVisible);
            setEditStateId(null);
            setName('');
          }}>
            {isFormVisible ? "Cancel" : "Add New State"}
          </button>

          {isFormVisible && (
            <form className="state-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="State Name"
                required
              />
              <button type="submit">{editStateId ? "Update State" : "Add State"}</button>
            </form>
          )}

          <div className="state-list">
            <h2>State List</h2>
            <table className="state-table">
              <thead>
                <tr>
                  <th>State Name</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {states.map(state => (
                  <tr key={state._id}>
                    <td>{state.name}</td>
                    <td>
                      <button className="edit-link" onClick={() => handleEdit(state._id)}>Edit</button>
                    </td>
                    <td>
                      <button className="delete-button1" onClick={() => handleDelete(state._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination-controls">
              <button
                className="prev-button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="next-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddState;

