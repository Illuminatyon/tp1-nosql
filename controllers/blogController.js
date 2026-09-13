import Blog from '../models/blog.js';
import User from "../models/User.js";

async function getAllBlogs(req, res){
    try {
        console.log("Getting all blogs");
        const blogs = await Blog.find();
        res.send(blogs);
    } catch (err) {
        res.status(500).send(err);
    }
}
async function createBlogWithPost(req, res) {
    try {
        const title = req.body.title;
        const author = req.body.author;
        const content = req.body.content;
        if (!title || !author || !content) {
            return res.status(400).send("Le titre, l'auteur et le contenu sont requis.");
        }
        const newBlog = await Blog.create({title: title, author: author, content: content, createdAt: new Date(), updatedAt: new Date()});
        if(!newBlog){
            return res.status(400).send("Erreur lors de la création du blog.");
        }
        res.status(201).send(newBlog);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function getId(req, res){
    try {
        const id = req.params.id;
        const document = await Blog.findById(id);
        if (!document){
            return res.status(404).send("Article introuvable.");
        }
        res.status(200).send(document);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function getBlogsByName(req, res){
    try {
        const author = req.params.author;
        const tableauBlogs = await Blog.find({author: author});
        res.status(200).send(tableauBlogs);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function updateBlog(req, res) {
    try {
        const idUpdate = req.params.id;

        const newTitle = req.body.title;
        const newAuthor = req.body.author;
        const newContent = req.body.content;

        if(newTitle){
            await Blog.updateOne({_id: idUpdate},{$set: {title: newTitle, updatedAt: new Date()}});
        }
        if(newAuthor){
            await Blog.updateOne({_id: idUpdate}, {$set: {author: newAuthor, updatedAt: new Date()}});
        }
        if(newContent){
            await Blog.updateOne({_id: idUpdate},{$set: {content: newContent, updatedAt: new Date()}});
        }
        const updateBlog = await Blog.findByIdAndUpdate(idUpdate, {$set: {title: newTitle, author: newAuthor, content: newContent, updatedAt: new Date()}}, {new: true});
        if(!updateBlog){
            return res.status(404).send("Article introuvable.");
        }
        res.status(200).send(updateBlog);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function deleteBlog(req, res){
    try {
        const idBlogDelete = req.params.id;
        const query = await Blog.deleteOne({_id: idBlogDelete});
        if(query.deletedCount === 0){
            return res.status(404).send("Article introuvable.");
        }
        res.status(200).send("Un document à été supprimé.");
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function addComment(req, res) {
    try {
        const idBlog = req.params.id;
        const user = req.body.user;
        const content = req.body.content;
        const note = req.body.note;

        if (!user || !content || note === undefined) {
            return res.status(400).send("Le nom de l'utilisateur, le contenu du commentaire et la note sont requis.");
        }
        const updatedBlog = await Blog.findByIdAndUpdate(
            idBlog,
            { $push: { comments: { user, content, note } } },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).send("Article introuvable.");
        }
        res.status(201).send(updatedBlog);
    } catch (err) {
        res.status(500).send({ message: "Erreur serveur", error: err.message });
    }
}


async function showComment(req, res) {
    try {
        const id = req.params.id;
        const blog = await Blog.findById(id, { comments: 1, _id: 0 });
        if (!blog) {
            return res.status(404).send({ message: "Article introuvable." });
        }
        res.status(200).send(blog.comments);
    } catch (err) {
        res.status(500).send({ message: "Erreur serveur", error: err.message });
    }
}

export default { getAllBlogs, createBlogWithPost, getId, getBlogsByName, updateBlog, deleteBlog, addComment, showComment};