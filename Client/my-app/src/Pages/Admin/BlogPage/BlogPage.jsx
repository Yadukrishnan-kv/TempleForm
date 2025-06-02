import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './BlogPage.css';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { toast } from 'react-toastify';

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
  const [editMode, setEditMode] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);
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

  const logAction = async (action, details) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ip}/api/adminlogin/log-action`,
        {
          action,
          module: 'Blog Page',
          subModule: editMode ? 'Update Blog' : 'Create Blog',
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
      if (editMode) {
        // Update blog
        await axios.put(`${ip}/api/Blog/updateblog/${editBlogId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        await logAction('Update', `Updated Blog: ${editBlogId}`);
        toast.success('Blog updated successfully!');
      } else {
        // Create new blog
        await axios.post(`${ip}/api/Blog/createblog`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        await logAction('Create', `Created new Blog: ${formData}`);
        toast.success('Blog created successfully!');
      }

      setNewBlog({ title: '', content: '', authorName: '', authorRole: '' });
      setSelectedImage(null);
      setEditMode(false);
      setEditBlogId(null);
      fetchBlogs();
    } catch (error) {
      setError('Failed to submit blog post');
      console.error('Error submitting blog post:', error);
      toast.error('Error submitting Blog!');
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete the blog post`)) {
      return;
    }
  
    try {
      // Send a DELETE request to the server
      await axios.delete(`${ip}/api/Blog/deleteblog/${blogId}`);
      
      // Refresh the blog list to reflect changes in the UI
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      
      // Log the action for auditing purposes
      await logAction('Delete', `Deleted Blog: ${blogTitle}`);
  
      // Notify the user of success
      toast.success(`Blog  deleted successfully!`);
    } catch (error) {
      // Handle errors and notify the user
      setError('Failed to delete the blog post');
      console.error('Error deleting blog post:', error);
      toast.error('Error deleting the blog post!');
    }
  };
  
  const handleEdit = (blog) => {
    setNewBlog({
      title: blog.title,
      content: blog.content,
      authorName: blog.author.name,
      authorRole: blog.author.role
    });
    setEditMode(true);
    setEditBlogId(blog._id);
    setSelectedImage(null); // Reset selected image for update
  };

  return (
    <div >
      <Header />
      <div className="content-container">
        <Sidebar />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="blog-page">
            <form onSubmit={handleSubmit} className="blog-form">
              <h2>{editMode ? 'Update Blog Post' : 'Create New Blog Post'}</h2>
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
              <input type="file" accept="image/*" onChange={handleImageSelect} />
              <button type="submit" disabled={loading}>
                {loading ? (editMode ? 'Updating...' : 'Creating...') : editMode ? 'Update Blog Post' : 'Create Blog Post'}
              </button>
            </form>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="blogview-page">
    <div className="blog-list">
        {blogs.length > 0 ? (
            blogs.map((blog) => (
                <div key={blog._id} className="blog-item">
                    {blog.image && (
                        <img
                            src={`${ip}/${blog.image.path}`}
                            alt={blog.title}
                            className="blog-image1"
                        />
                    )}
                    <div className="blog-content">
                        <h2 className="blog-title">{blog.title}</h2>
                        <p className="blog-text">{blog.content}</p>
                        <div className="blog-meta">
                            <p >Author: {blog.author.name} ({blog.author.role})</p>
                            <p>Date: {new Date(blog.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="blog-buttons">
                        <button onClick={() => handleEdit(blog._id)} className="blogedit-button">
                            Update
                        </button>
                        <button onClick={() => handleDelete(blog._id)} className="delete-button">
                            Delete
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <div className="no-blogs">No blog posts yet. Create one to get started.</div>
        )}
    </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default BlogPage;
