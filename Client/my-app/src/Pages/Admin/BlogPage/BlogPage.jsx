import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './BlogPage.css';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    authorName: '',
    authorRole: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const ip = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${ip}/api/Blog/getblog`);
      setBlogs(response.data);
    } catch (error) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBlog(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageSelect = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', newBlog.title);
    formData.append('content', newBlog.content);
    formData.append('authorName', newBlog.authorName);
    formData.append('authorRole', newBlog.authorRole);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.post(`${ip}/api/Blog/createblog`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewBlog({ title: '', content: '', authorName: '', authorRole: '' });
      setSelectedImage(null);
      fetchBlogs();
    } catch (error) {
      setError('Failed to create blog post');
      console.error('Error creating blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await axios.delete(`${ip}/api/Blog/deleteblog/${blogId}`);
      fetchBlogs();
    } catch (error) {
      setError('Failed to delete blog post');
      console.error('Error deleting blog post:', error);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div style={{display:"flex",flexDirection:"column"}}>
        <div className="blog-page">

          <form onSubmit={handleSubmit} className="blog-form">
            <h2>Create New Blog Post</h2>
            <input
              type="text"
              name="title"
              value={newBlog.title}
              onChange={handleInputChange}
              placeholder="Blog Title"
              required
            />
            <textarea
              name="content"
              value={newBlog.content}
              onChange={handleInputChange}
              placeholder="Blog Content"
              required
            />
            <input
              type="text"
              name="authorName"
              value={newBlog.authorName}
              onChange={handleInputChange}
              placeholder="Author Name"
              required
            />
            <input
              type="text"
              name="authorRole"
              value={newBlog.authorRole}
              onChange={handleInputChange}
              placeholder="Author Role"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Blog Post'}
            </button>
          </form>
          </div>

          {error && <div className="error-message">{error}</div>}

         <div className='blogview-page'>
          <div className="blog-list">
  {blogs.map((blog) => (
    <div key={blog._id} className="blog-item">
      <div className="blog-content">
      {blog.image && (
        <img 
          src={`${ip}/${blog.image.path}`} 
          alt={blog.title} 
          className="blog-image1"
        />
      )}
        <h2 className="blog-title">{blog.title}</h2>
        <p className="blog-text">{blog.content}</p>
        <div className="blog-meta">
          <p>Author: {blog.author.name} ({blog.author.role})</p>
          <p>Date: {new Date(blog.date).toLocaleDateString()}</p>
        </div>
      </div>
     
      <button onClick={() => handleDelete(blog._id)} className="delete-button">Delete</button>
    </div>
  ))}
  {blogs.length === 0 && (
    <div className="no-blogs">
      No blog posts yet. Create one to get started.
    </div>
  )}
</div>

</div>
</div>
      </div>
    </div>
  );
};

export default BlogPage;

