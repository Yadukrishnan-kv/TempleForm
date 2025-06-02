import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './GalleryPage.css';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { toast } from 'react-toastify';

const GalleryPage = () => {
  const { templeId, photoId } = useParams();
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilePreviews, setSelectedFilePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [temple, setTemple] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [updateFile, setUpdateFile] = useState(null);
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    fetchTempleDetails();
    fetchImages();
  }, [templeId]);

  // Cleanup preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      selectedFilePreviews.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [selectedFilePreviews]);

  const fetchTempleDetails = async () => {
    try {
      const response = await axios.get(`${ip}/api/temples/${templeId}`);
      setTemple(response.data);
    } catch (error) {
      console.error('Error fetching temple details:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${ip}/api/Gallery/temple/${templeId}`);
      setImages(response.data);
    } catch (error) {
      setError('Failed to fetch images');
      console.error('Error fetching images:', error);
    }
  };

  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'Registration',
          subModule: 'List Details-Gallery',
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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 10) {
      alert('You can only upload up to 10 images at once');
      return;
    }

    // Clean up previous preview URLs
    selectedFilePreviews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });

    // Create preview objects with URLs and file references
    const previews = files.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setSelectedFiles(files);
    setSelectedFilePreviews(previews);
  };

  const removeSelectedImage = (previewId) => {
    const updatedPreviews = selectedFilePreviews.filter(preview => {
      if (preview.id === previewId) {
        // Clean up the URL for the removed image
        URL.revokeObjectURL(preview.url);
        return false;
      }
      return true;
    });

    // Update the files array to match the previews
    const updatedFiles = updatedPreviews.map(preview => preview.file);

    setSelectedFilePreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
  };

  const clearAllSelected = () => {
    // Clean up all preview URLs
    selectedFilePreviews.forEach(preview => {
      URL.revokeObjectURL(preview.url);
    });
    
    setSelectedFiles([]);
    setSelectedFilePreviews([]);
    
    // Reset the file input
    const fileInput = document.querySelector('.file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('photos', file);
    });

    try {
      setLoading(true);
      await axios.post(`${ip}/api/Gallery/upload/${templeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Clear selected files and previews after successful upload
      clearAllSelected();
      fetchImages();
      await logAction('Create', `Created new Gallery: ${formData}`);
      toast.success("Images uploaded successfully!");
      
    } catch (error) {
      setError('Failed to upload images');
      console.error('Error uploading images:', error);
      toast.error('Error uploading images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await axios.delete(`${ip}/api/Gallery/${photoId}`);
      fetchImages();
      toast.success("Image deleted successfully!");
      await logAction('Delete', `Deleted photo: ${photoId}`);
    } catch (error) {
      setError('Failed to delete image');
      console.error('Error deleting image:', error);
      toast.error("Error deleting Image!"); 
    }
  };

  const handleUpdateFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUpdateFile(file);
    }
  };

  const handleUpdate = async (photoId) => {
    if (!updateFile) {
      toast.error("Please select a file to update");
      return;
    }

    const formData = new FormData();
    formData.append("photo", updateFile);

    try {
      setLoading(true);
      await axios.put(`${ip}/api/Gallery/${photoId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEditingId(null);
      setUpdateFile(null);
      fetchImages();
      toast.success("Image updated successfully!");
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Error updating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="gallery-page">
          <div className="gallery-header">
            <h1>{temple?.name}</h1>
          </div>

          <div className="upload-section">
            <div className="upload-instructions1">
              <h3>Add Images</h3>
            </div>
            <div className="upload-controls">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileSelect} 
                className="file-input" 
              />
              <div className="upload-buttons">
                <button 
                  onClick={handleUpload} 
                  disabled={loading || selectedFiles.length === 0} 
                  className="upload-button"
                >
                  {loading ? "Uploading..." : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`}
                </button>
                {selectedFiles.length > 0 && (
                  <button 
                    onClick={clearAllSelected} 
                    className="clear-button"
                    disabled={loading}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Album-style preview section */}
            {selectedFilePreviews.length > 0 && (
              <div className="selected-images-preview">
                <div className="preview-header">
                  <h4>Selected Images ({selectedFilePreviews.length})</h4>
                </div>
                <div className="preview-grid">
                  {selectedFilePreviews.map((preview) => (
                    <div key={preview.id} className="preview-item">
                      <div className="preview-image-container">
                        <img 
                          src={preview.url || "/placeholder.svg"} 
                          alt={preview.name} 
                          className="preview-image" 
                        />
                        <button 
                          onClick={() => removeSelectedImage(preview.id)}
                          className="remove-preview-button"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                      <div className="preview-filename">
                        {preview.name.length > 20 
                          ? `${preview.name.substring(0, 17)}...` 
                          : preview.name
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="gallery-grid">
            {images.map((image) => (
              <div key={image._id} className="gallery-item">
                <div className="image-container">
                  <img src={`${ip}/${image.path}`} alt="Temple image" className="gallery-image" />
                </div>
                <div className="gallery-item-controls">
                  {editingId === image._id ? (
                    <div className="update-controls">
                      <input type="file" accept="image/*" onChange={handleUpdateFileSelect} className="file-input" />
                      <div className="button-group">
                        <button
                          onClick={() => handleUpdate(image._id)}
                          disabled={!updateFile || loading}
                          className="update-button"
                        >
                          {loading ? "Updating..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setUpdateFile(null);
                          }}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setEditingId(image._id)} className="galleryupdate-button">
                        Update Image
                      </button>
                      <button onClick={() => handleDelete(image._id)} className="delete-button">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="no-images">No images uploaded yet. Add some images to get started.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;