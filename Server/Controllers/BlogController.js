const Blog = require('../Models/BlogModel');
const fs = require('fs').promises;

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
            await fs.unlink(blog.image.path);
        }
        
        await Blog.findByIdAndDelete(req.params.blogId);
        
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Error deleting blog post' });
    }
};

const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const { title, content, authorName, authorRole } = req.body;

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.author.name = authorName || blog.author.name;
        blog.author.role = authorRole || blog.author.role;

        if (req.file) {
            if (blog.image && blog.image.path) {
                await fs.unlink(blog.image.path);
            }

            blog.image = {
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: req.file.path
            };
        }

        await blog.save();
        
        res.json(blog);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ message: 'Error updating blog post' });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    deleteBlog,
    updateBlog
};