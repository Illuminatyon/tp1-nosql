import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const blogSchema = new Schema({
    title: String,
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'},
    content: String,
    createdAt: Date,
    updatedAt: Date,
    comments: [{
        user: String,
        content: String,
        note: Number
    }]
});

const Blog = model('Blog', blogSchema);

export default Blog;