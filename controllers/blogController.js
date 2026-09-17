import Blog from '../models/blog.js';
import User from "../models/User.js";

async function getAllBlogs(req, res){
    try {
        const blogs = await Blog.find();
        trierBlogs(blogs, req.query.sortBy, req.query.order);
        res.send(blogs);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function createBlogWithPost(req, res) {
    try {
        const title = req.body.title;
        const author = req.userId;
        const content = req.body.content;

        if (!title || !content) {
            return res.status(400).send("Le titre et le contenu sont requis.");
        }
        const newBlog = await Blog.create({title: title, author: author, content: content, createdAt: new Date(), updatedAt: new Date()});
        if(!newBlog){
            return res.status(400).send("Erreur lors de la création du blog.");
        }
        res.status(201).send(newBlog);
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).send({message: "Les données de l'article sont invalides.", error: err.message});
        }
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
        if (err.name === 'CastError') {
            return res.status(400).send({message: "Identifiant d'article invalide.", error: err.message});
        }
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function getBlogsByName(req, res){
    try {
        const author = req.params.author;
        const idsAuteurs = await findBlogWithUser(author);
        const tableauBlogs = await Blog.find({author: {$in: idsAuteurs}});
        trierBlogs(tableauBlogs, req.query.sortBy, req.query.order);
        res.status(200).send(tableauBlogs);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).send({message: "Paramètre de recherche invalide.", error: err.message});
        }
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function updateBlog(req, res) {
    try {
        const idUpdate = req.params.id;

        const updateFields = { updatedAt: new Date() };
        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.author) updateFields.author = req.body.author;
        if (req.body.content) updateFields.content = req.body.content;

        const updatedBlog = await Blog.findByIdAndUpdate(idUpdate, {$set: updateFields}, {new: true, runValidators: true});
        if(!updatedBlog){
            return res.status(404).send("Article introuvable.");
        }
        res.status(200).send(updatedBlog);
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).send({message: "Les données de modification sont invalides.", error: err.message});
        }
        res.status(500).send({message: "Erreur serveur", error: err.message});
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
        if (err.name === 'CastError') {
            return res.status(400).send({message: "Identifiant d'article invalide.", error: err.message});
        }
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function addComment(req, res) {
    try {
        const idBlog = req.params.id;
        const user = req.userId;
        const content = req.body.content;
        const note = req.body.note;

        if (!content || note === undefined) {
            return res.status(400).send("Le contenu du commentaire et la note sont requis.");
        }
        const updatedBlog = await Blog.findByIdAndUpdate(
            idBlog,
            { $push: { comments: { user, content, note } } },
            { new: true, runValidators: true }
        );
        if (!updatedBlog) {
            return res.status(404).send("Article introuvable.");
        }
        res.status(201).send(updatedBlog);
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).send({message: "Les données du commentaire sont invalides.", error: err.message});
        }
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function showComment(req, res) {
    try {
        const id = req.params.id;
        const blog = await Blog.findById(id, { comments: 1, _id: 0 })
            .populate('comments.user', 'nom prenom username');
        if (!blog) {
            return res.status(404).send({ message: "Article introuvable." });
        }
        res.status(200).send(blog.comments);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).send({message: "Identifiant d'article invalide.", error: err.message});
        }
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function findBlogWithUser(fragment) {
    const users = await User.find({
        $or: [
            { nom: { $regex: fragment, $options: 'i' } },
            { prenom: { $regex: fragment, $options: 'i' } },
            { username: { $regex: fragment, $options: 'i' } }
        ]
    }, { _id: 1 });
    return users.map(u => u._id);
}

function trierBlogs(tableau, sortBy, order) {
    if (sortBy === 'title') {
        tableau.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'createdAt') {
        tableau.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sortBy === 'updatedAt') {
        tableau.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    }
    if (sortBy === 'comments') {
        tableau.sort((a, b) => a.comments.length - b.comments.length);
    }
    if (sortBy === 'avgNote') {
        tableau.sort((a, b) => {
            const moyenneA = a.comments.reduce((total, c) => total + (c.note || 0), 0) / (a.comments.length || 1);
            const moyenneB = b.comments.reduce((total, c) => total + (c.note || 0), 0) / (b.comments.length || 1);
            return moyenneA - moyenneB;
        });
    }
    if (order === 'desc') {
        tableau.reverse();
    }
    return tableau;
}

async function searchBlogs(req, res) {
    try {
        const titleBlog = req.query.title;
        const authorName = req.query.author;
        const sortByParam = req.query.sortBy;
        const orderParam = req.query.order;

        const filter = {};

        if (titleBlog) {
            filter.title = { $regex: titleBlog, $options: 'i' };
        }
        if (authorName) {
            const idsAuteurs = await findBlogWithUser(authorName);
            filter.author = { $in: idsAuteurs };
        }
        const tableauBlogs = await Blog.find(filter);
        trierBlogs(tableauBlogs, sortByParam, orderParam);
        res.status(200).send(tableauBlogs);
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'ValidationError') {
            return res.status(400).send({message: "Paramètres de recherche invalides.", error: err.message});
        }
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function complexSearch(req, res) {
    try {
        const authorName = req.query.author;
        const dateFrom = req.query.from;
        const dateTo = req.query.to;
        const commenterName = req.query.comments;

        if (!authorName || !dateFrom || !dateTo || !commenterName) {
            return res.status(400).send({ message: "Les paramètres author, from, to et comments sont requis." });
        }

        const authorIds = await findBlogWithUser(authorName);
        const commenterIds = await findBlogWithUser(commenterName);

        const query = await Blog.find({
            author: { $in: authorIds },
            createdAt: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
            comments: { $elemMatch: { user: { $in: commenterIds } } }
        });

        res.status(200).send(query);
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'ValidationError') {
            return res.status(400).send({message: "Paramètres de recherche invalides.", error: err.message});
        }
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

export default { getAllBlogs, createBlogWithPost, getId, getBlogsByName, updateBlog, deleteBlog, addComment, showComment, searchBlogs, complexSearch };