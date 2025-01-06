const { Schema, model } = require("mongoose");

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
        }
    },
    image: {
        filename: String,
        originalname: String,
        path: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Blog = model('Blog', BlogSchema);

module.exports = Blog;