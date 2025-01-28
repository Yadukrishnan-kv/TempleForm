import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


import { toast } from 'react-toastify';

function TempleFormGallery() {
    const { templeId } = useParams();
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [temple, setTemple] = useState(null);
    const ip = process.env.REACT_APP_BACKEND_IP;
  
    useEffect(() => {
      fetchTempleDetails();
      fetchImages();
    }, [templeId]);
  
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
  
   
  
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 10) {
        alert('You can only upload up to 10 images at once');
        return;
      }
      setSelectedFiles(files);
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
        setSelectedFiles([]);
        fetchImages();
  
        toast.success(" Image uploaded successfully!");
        
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
  
        
      } catch (error) {
        setError('Failed to delete image');
        console.error('Error deleting image:', error);
                toast.error("Error deleting Image!"); 
        
      }
    };
  return (
    <div>
        <div className="gallery-page">
          <div className="gallery-header">
            <h1>{temple?.name} Gallery</h1>
            <p className="temple-details">{temple?.address}</p>
          </div>

          <div className="upload-section">
            <div className="upload-instructions1">
              <h3>Add Images</h3>
              <p>Upload up to 4 images at once. Supported formats: JPG, PNG</p>
            </div>
            <div className="upload-controls">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
              />
              <button 
                onClick={handleUpload}
                disabled={loading || selectedFiles.length === 0}
                className="upload-button"
              >
                {loading ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="gallery-grid">
            {images.map((image) => (
              <div key={image._id} className="gallery-item">
                <div className="image-container">
                  <img 
                    src={`${ip}/${image.path}`} 
                    alt={image.caption || 'Temple image'} 
                    className="gallery-image"
                  />
                </div>
                <div className="gallery-item-controls">
                 
                  <button 
                    onClick={() => handleDelete(image._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="no-images">
                No images uploaded yet. Add some images to get started.
              </div>
            )}
          </div>
        </div>
    </div>
  )
}

export default TempleFormGallery