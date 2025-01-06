const express = require('express');
const router = express.Router();
const blogController = require('../Controllers/BlogController');
const upload = require('../Config/multer');

// Create a new blog post
router.post('/createblog', upload.single('image'), blogController.createBlog);

// Get all blog posts
router.get('/getblog', blogController.getBlogs);

// Delete a blog post
router.delete('/deleteblog/:blogId', blogController.deleteBlog);

// Update a blog post
router.put('/updateblog/:blogId', upload.single('image'), blogController.updateBlog);

module.exports = router;