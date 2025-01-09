import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import './AddState.css';
import { toast } from 'react-toastify';

const AddState = () => {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const [name, setName] = useState('');
  const [states, setStates] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editStateId, setEditStateId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStates, setTotalStates] = useState(0);
  const [statesPerPage] = useState(5);

  // Function to log actions
  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'Master',
          subModule: 'Manage States',
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

  useEffect(() => {
    fetchStates();
  }, [currentPage]);

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        `${ip}/api/states/getAllStates?page=${currentPage}&limit=${statesPerPage}`
      );
      setStates(response.data.states);
      setTotalStates(response.data.totalStates);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editStateId) {
        await axios.put(`${ip}/api/states/updateState/${editStateId}`, { name });
        await logAction('Update', `Updated state: ${name}`);
        toast.success('State updated successfully!');
      } else {
        await axios.post(`${ip}/api/states/createState`, { name });
        await logAction('Create', `Created new state: ${name}`);
        toast.success('State created successfully!');
      }
      setName('');
      setEditStateId(null);
      setIsFormVisible(false);
      fetchStates();
    } catch (error) {
      console.error(error);
      toast.error(editStateId ? 'Error updating state!' : 'Error creating state!');
    }
  };

  const handleDelete = async (id, stateName) => {
    try {
      await axios.delete(`${ip}/api/states/deleteState/${id}`);
      await logAction('Delete', `Deleted state: ${stateName}`);
      setStates(states.filter(state => state._id !== id));
      toast.success("State deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting state!");
    }
  };

  const handleEdit = async (id) => {
    const stateToEdit = states.find(state => state._id === id);
    if (stateToEdit) {
      setName(stateToEdit.name);
      setEditStateId(id);
      setIsFormVisible(true);
    }
  };

  const handleAddNewClick = async () => {
    setIsFormVisible(!isFormVisible);
    setEditStateId(null);
    setName('');
    
  };

  const totalPages = Math.ceil(totalStates / statesPerPage);

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
          <button 
            className="add-button" 
            onClick={handleAddNewClick}
          >
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
              <button type="submit">
                {editStateId ? "Update State" : "Add State"}
              </button>
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
                      <button 
                        className="edit-link" 
                        onClick={() => handleEdit(state._id)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button 
                        className="delete-button1" 
                        onClick={() => handleDelete(state._id, state.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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