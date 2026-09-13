import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const blogSchema = new Schema({
    title: { type: String, required: [true, "Le titre est requis."] },
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: [true, "L'auteur est requis."] },
    content: { type: String, required: [true, "Le contenu est requis."] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    comments: [{
        user: { type: String, required: true },
        content: { type: String, required: true },
        note: { type: Number, min: 0, max: 5 }
    }]
});

const Blog = model('Blog', blogSchema);

export default Blog;