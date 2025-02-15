const Blog = require('../Models/BlogModel');
const fs = require('fs').promises;
const path = require('path');

const createBlog = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const { title, content, authorName, authorRole } = req.body;

        const blog = new Blog({
            title,
            content,
            author: {
                name: authorName,
                role: authorRole 
            },
            image: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: `api/${req.file.path}`
            }
        });

        await blog.save();

        res.status(201).json({
            message: 'Blog post created successfully',
            blog: blog
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Error creating blog post', error: error.message });
    }
};

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ message: 'Error fetching blog posts' });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        if (blog.image && blog.image.path) {
            const fullPath = path.join(__dirname, '..', blog.image.path);
            console.log('Attempting to delete file:', fullPath);

            try {
                await fs.access(fullPath);
                await fs.unlink(fullPath);
                console.log('File deleted successfully');
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        
        await Blog.findByIdAndDelete(req.params.blogId);
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Error deleting blog post', error: error.message });
    }
};
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const { title, content, authorName, authorRole } = req.body;

        // Update text fields
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        if (blog.author) {
            blog.author.name = authorName || blog.author.name;
            blog.author.role = authorRole || blog.author.role;
        }

        // Handle image update if a new file is uploaded
        if (req.file) {
            // Delete old image if it exists
            if (blog.image && blog.image.path) {
                try {
                    const oldImagePath = path.join(process.cwd(), blog.image.path);
                    await fs.unlink(oldImagePath);
                    console.log('Old image deleted successfully');
                } catch (unlinkError) {
                    console.error('Error deleting old image:', unlinkError);
                    // Continue with update even if old file deletion fails
                }
            }

            // Update with new image
            blog.image = {
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: `api/${req.file.path}`
            };
        }

        // Save the updated blog
        const updatedBlog = await blog.save();
        
        res.json({
            message: 'Blog post updated successfully',
            blog: updatedBlog
        });
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ 
            message: 'Error updating blog post', 
            error: error.message 
        });
    }
};


module.exports = {
    createBlog,
    getBlogs,
    deleteBlog,
    updateBlog
};