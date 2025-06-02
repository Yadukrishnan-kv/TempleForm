import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import './AddState.css'; // Assuming you want to keep same styles
import { toast } from 'react-toastify';

const AddLSG = () => {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const [name, setName] = useState('');
  const [lsgs, setLSGs] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editLSGId, setEditLSGId] = useState(null);

  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'Master',
          subModule: 'Manage lsg',
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

  useEffect(() => {
    fetchLSGs();
  }, []);

 const fetchLSGs = async () => {
  try {
    const response = await axios.get(`${ip}/api/lsg/getAllLsgs`);
    setLSGs(response.data ?? []);  // <-- changed here
  } catch (error) {
    console.error(error);
    setLSGs([]);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editLSGId) {
        await axios.put(`${ip}/api/lsg/updateLsg/${editLSGId}`, { name });
        await logAction('Update', `Updated LSG: ${name}`);
        toast.success('LSG updated successfully!');
      } else {
        await axios.post(`${ip}/api/lsg/createlsg`, { name });
        await logAction('Create', `Created new LSG: ${name}`);
        toast.success('LSG created successfully!');
      }
      setName('');
      setEditLSGId(null);
      setIsFormVisible(false);
      await fetchLSGs(); // Refresh list immediately after add/update
    } catch (error) {
      console.error(error);
      toast.error(editLSGId ? 'Error updating LSG!' : 'Error creating LSG!');
    }
  };

  const handleDelete = async (id, lsgName) => {
    try {
      await axios.delete(`${ip}/api/lsg/deleteLsg/${id}`);
      await logAction('Delete', `Deleted LSG: ${lsgName}`);
      setLSGs((prev) => prev.filter((lsg) => lsg._id !== id));
      toast.success('LSG deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error deleting LSG!');
    }
  };

  const handleEdit = (id) => {
    const lsgToEdit = lsgs.find((lsg) => lsg._id === id);
    if (lsgToEdit) {
      setName(lsgToEdit.name);
      setEditLSGId(id);
      setIsFormVisible(true);
    }
  };

  const handleAddNewClick = () => {
    setIsFormVisible(!isFormVisible);
    setEditLSGId(null);
    setName('');
  };

  return (
    <div >
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="Statesubmission-page">
          <h2>Manage LSGs</h2>
          <button className="add-button" onClick={handleAddNewClick}>
            {isFormVisible ? 'Cancel' : 'Add New LSG'}
          </button>

          {isFormVisible && (
            <form className="state-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="LSG Name"
                required
              />
              <button type="submit">{editLSGId ? 'Update LSG' : 'Add LSG'}</button>
            </form>
          )}

          <div className="state-list">
            <h2>LSG List</h2>
            <table className="state-table">
              <thead>
                <tr>
                  <th>LSG Name</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(lsgs) && lsgs.length > 0 ? (
                  lsgs.map((lsg) => (
                    <tr key={lsg._id}>
                      <td>{lsg.name}</td>
                      <td>
                        <button className="edit-link" onClick={() => handleEdit(lsg._id)}>
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="delete-button1"
                          onClick={() => handleDelete(lsg._id, lsg.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>
                      No LSGs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLSG;


