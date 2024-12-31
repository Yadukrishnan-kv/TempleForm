import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './AboutTemple.css';
import { useParams } from 'react-router-dom';

function AboutTemple() {
    const [descriptions, setDescriptions] = useState([]);
    const [newDescription, setNewDescription] = useState('');
    const [editing, setEditing] = useState(null);
    const [editedDescription, setEditedDescription] = useState('');
    const { templeId } = useParams(); // Correct destructuring
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
            setDescriptions([...descriptions, res.data.data]);
            setNewDescription('');
        } catch (error) {
            console.error('Error adding description', error);
        }
    };

    const editDescription = async (id) => {
        try {
            const res = await axios.put(`${ip}/api/aboutTemple/updateaboutTemple/${id}`, {
                description: editedDescription,
            });
            setDescriptions(descriptions.map((desc) => (desc._id === id ? res.data.data : desc)));
            setEditing(null);
            setEditedDescription('');
        } catch (error) {
            console.error('Error editing description', error);
        }
    };

    const deleteDescription = async (id) => {
        try {
            await axios.delete(`${ip}/api/aboutTemple/deleteaboutTemple/${id}`);
            setDescriptions(descriptions.filter((desc) => desc._id !== id));
        } catch (error) {
            console.error('Error deleting description', error);
        }
    };

    return (
        <div className="app-container">
            <Header />
            <div className="content-container">
                <Sidebar />
                <div className="about-temple-container">
                    <h2>About Temple</h2>
                    <textarea
                        placeholder="Add new description"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <button onClick={addDescription} className="btn btn-success">
                        Add Description
                    </button>
                    <div className="description-list">
                        {descriptions.map((desc) => (
                            <div key={desc._id} className="description-item">
                                {editing === desc._id ? (
                                    <>
                                        <textarea
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                        />
                                        <button onClick={() => editDescription(desc._id)} className="btn btn-primary">
                                            Save
                                        </button>
                                        <button onClick={() => setEditing(null)} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p>{desc.description}</p>
                                        <button onClick={() => setEditing(desc._id)} className="btn btn-warning">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteDescription(desc._id)} className="btn btn-danger">
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutTemple;

