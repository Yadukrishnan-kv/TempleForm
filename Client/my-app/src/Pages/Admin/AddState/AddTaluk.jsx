import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import './AddState.css'; // Reuse the same CSS file
import { toast } from 'react-toastify';

function AddTaluk() {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTalukId, setEditingTalukId] = useState(null);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch all taluks
  useEffect(() => {
    axios.get(`${ip}/api/taluks/getAllTaluks`)
      .then(response => {
        setTaluks(response.data);
      })
      .catch(error => console.error(error));
  }, [ip]);

  // Fetch all states
  useEffect(() => {
    axios.get(`${ip}/api/states/getAllStates`)
      .then(response => {
        console.log("API response:", response.data); // Log the API response
        const { states: statesArray } = response.data; // Extract the `states` array
        if (Array.isArray(statesArray)) {
          setStates(statesArray); // Set the extracted array
        } else {
          console.error("Expected an array but got:", statesArray);
        }
      })
      .catch(error => {
        console.error("Error fetching states:", error);
      });
  }, [ip]);
  
  // Function to log actions
  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'Master',
          subModule: 'Manage Taluks',
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
    // Fetch all districts
    axios.get(`${ip}/api/districts/getAllDistricts`)
      .then(response => {
        setDistricts(response.data);
      })
      .catch(error => console.error("Error fetching districts:", error));
  }, [ip]);
  
  useEffect(() => {
    if (state && districts.length > 0) {
      setFilteredDistricts(districts.filter(d => d.state._id === state));
    } else {
      setFilteredDistricts([]);
    }
  }, [state, districts]);
  

  // Function to reset the form
  const resetForm = () => {
    setName('');
    setState('');
    setDistrict('');
    setIsEditing(false);
    setIsFormVisible(false);
    setEditingTalukId(null);
  };

  // Handle form submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedState = states.find(s => s._id === state);
    const selectedDistrict = districts.find(d => d._id === district);

    if (isEditing) {
      // Update Taluk
      axios.put(`${ip}/api/taluks/updateTaluk/${editingTalukId}`, { name, district, state })
        .then((response) => {
          setTaluks(prevTaluks =>
            prevTaluks.map(taluk =>
              taluk._id === editingTalukId
                ? { ...response.data, district: selectedDistrict, state: selectedState }
                : taluk
            )
          );
          resetForm();
           logAction('Update', `updated new Taluk: ${name}`);

          toast.success('Taluk updated successfully!');
        })
        .catch((error) => {
          console.error(error);
          toast.error('Error updating taluk!'); // Error toast for update
        });
    } else {
      // Create Taluk
      axios.post(`${ip}/api/taluks/createTaluk`, { name, district, state })
        .then((response) => {
          const newTaluk = {
            ...response.data,
            district: selectedDistrict,
            state: selectedState
          };
          setTaluks([...taluks, newTaluk]);
          logAction('Create', `created new Taluk: ${name}`);

          toast.success('Taluk created successfully!');

          resetForm();
        })
        .catch((error) => {
          console.error(error)
        toast.error('Error creating Taluk!'); 
          
    });
    }
  };

  // Function to handle edit action
  const handleEdit = (taluk) => {
    setName(taluk.name);
    setState(taluk.state?._id || '');
    setDistrict(taluk.district?._id || '');
    setIsEditing(true);
    setIsFormVisible(true);
    setEditingTalukId(taluk._id);
  };

  // Handle delete action
  const handleDelete = (id,talukName) => {
    axios.delete(`${ip}/api/taluks/deleteTaluk/${id}`)
    
      .then(() => {
        setTaluks(taluks.filter(taluk => taluk._id !== id));
         logAction('Delete', `Deleted Taluk: ${talukName}`);

                toast.success("Taluk deleted successfully!"); 
        
      })
        .catch((error) => {
        console.error(error);
        toast.error("Error deleting Taluk!"); 
      });  };

  // Get current page taluks
  const indexOfLastTaluk = currentPage * itemsPerPage;
  const indexOfFirstTaluk = indexOfLastTaluk - itemsPerPage;
  const currentTaluks = taluks.slice(indexOfFirstTaluk, indexOfLastTaluk);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(taluks.length / itemsPerPage);

  return (
    <div >
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="Statesubmission-page">
          <h2>Manage Taluks</h2>
          <button className="add-button" onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? "Cancel" : isEditing ? "Edit Taluk" : "Add New Taluk"}
          </button>

          {/* Add Taluk Form */}
          {isFormVisible && (
            <form className="state-form" onSubmit={handleSubmit}>
              {/* State Dropdown */}
              <select value={state} onChange={(e) => setState(e.target.value)} required>
                <option value="">Select State</option>
                {states.map((state, index) => (
                <option key={index} value={state._id}>
                {state.name}
               </option>
                ))}
              </select>

              {/* District Dropdown */}
              <select value={district} onChange={(e) => setDistrict(e.target.value)} required>
                <option value="">Select District</option>
                {filteredDistricts.map(district => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Taluk Name"
                required
              />
              <button type="submit">{isEditing ? "Update Taluk" : "Add Taluk"}</button>
            </form>
          )}

          {/* Taluk List */}
          <div className="state-list">
            <h2>Taluk List</h2>
            <table className="taluk-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>District</th>
                  <th>Taluk</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentTaluks.map((taluk) => (
                  <tr key={taluk._id}>
                    <td>{taluk.state?.name || 'Unknown State'}</td>
                    <td>{taluk.district?.name || 'Unknown District'}</td>
                    <td>{taluk.name}</td>
                    <td>
                      <button className="edit-link" onClick={() => handleEdit(taluk)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="delete-button1" onClick={() => handleDelete(taluk._id,taluk.name)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTaluk;
