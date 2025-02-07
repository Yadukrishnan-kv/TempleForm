import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TempleFormAbout.css'
import { toast } from 'react-toastify';

function TempleFormAbout() {
    const [descriptions, setDescriptions] = useState([]);
    const [newDescription, setNewDescription] = useState('');
    const [editing, setEditing] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');
    const { templeId } = useParams();
    const ip = process.env.REACT_APP_BACKEND_IP;

    useEffect(() => {
        fetchDescriptions();
    }, [templeId]);

    const fetchDescriptions = async () => {
        try {
            const res = await axios.get(`${ip}/api/aboutTemple/getAllaboutTemple/${templeId}`);
            setDescriptions(res.data);
        } catch (error) {
            console.error('Error fetching descriptions', error);
        }
    };

    const addDescription = async () => {
        try {
            const res = await axios.post(`${ip}/api/aboutTemple/createaboutTemple`, {
                description: newDescription,
                templeId,
            });
            setDescriptions(prevDescriptions => [...prevDescriptions, res.data.data]);
            setNewDescription('');

            toast.success("Descriptions created successfully!");
        } catch (error) {
            toast.error('Error creating description');
        }
    };

    const editDescription = async (id) => {
        try {
            const res = await axios.put(`${ip}/api/aboutTemple/updateaboutTemple/${id}`, {
                description: editedDescription,
                templeId,
            });
            setDescriptions(prevDescriptions =>
                prevDescriptions.map(desc => (desc._id === id ? res.data.data : desc))
            );
            setEditing(null);
            setEditedDescription('');

            toast.success(" Description updated successfully!");

        } catch (error) {
            toast.error('Error updating description');
        }
    };

    const deleteDescription = async (id,newDescription) => {
        try {
            await axios.delete(`${ip}/api/aboutTemple/deleteaboutTemple/${id}`);
            setDescriptions(prevDescriptions => prevDescriptions.filter(desc => desc._id !== id));
            toast.success("Description deleted successfully!");

            
        } catch (error) {
            toast.error('Error deleting description');
        }
    };

  return (
    <div>
        <div className="TempleDash-about-temple-container">
                    <h2>About Temple</h2>
                    <div className="TempleDash-add-description">
                        <textarea
                            placeholder="Add new description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="TempleDash-description-input"
                            rows="5"
                        />
                        <button onClick={addDescription} className="TempleDash-btn btn-success">
                            Add Description
                        </button>
                    </div>
                    <div className="TempleDash-description-list">
                        {descriptions.map((desc) => (
                            <div key={desc._id} className="TempleDash-description-item">
                                {editing === desc._id ? (
                                    <div className="TempleDash-edit-description">
                                        <textarea
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            className="TempleDash-description-input"
                                            rows="5"
                                        />
                                        <div className="TempleDash-button-group">
                                            <button onClick={() => editDescription(desc._id)} className="TempleDash-btn TempleDash-btn-primary">
                                                Save
                                            </button>
                                            <button onClick={() => setEditing(null)} className="TempleDash-btn TempleDash-btn-secondary">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="TempleDash-view-description">
                                        <pre>{desc.description}</pre>
                                        <div className="button-group">
                                            <button 
                                                onClick={() => {
                                                    setEditing(desc._id);
                                                    setEditedDescription(desc.description);
                                                }} 
                                                className="TempleDash-btn TempleDash-btn-warning"
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteDescription(desc._id)} className="TempleDash-btn TempleDash-btn-danger">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
    </div>
  )
}

export default TempleFormAbout