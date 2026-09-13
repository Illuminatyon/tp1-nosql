import Blog from '../models/blog.js';
import User from "../models/User.js";

async function getAllBlogs(req, res){
    try {
        console.log("Getting all blogs");
        const blogs = await Blog.find();
        res.send(blogs);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
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
        const idsAuteurs = await findUserIdsByNameFragment(author);
        const tableauBlogs = await Blog.find({author: {$in: idsAuteurs}});
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

async function findUserIdsByNameFragment(fragment) {
    const users = await User.find({
        $or: [
            { nom: { $regex: fragment, $options: 'i' } },
            { prenom: { $regex: fragment, $options: 'i' } }
        ]
    }, { _id: 1 });
    return users.map(u => u._id);
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
            const idsAuteurs = await findUserIdsByNameFragment(authorName);
            filter.author = { $in: idsAuteurs };
        }

        const tableauBlogs = await Blog.find(filter);

        if (sortByParam === 'title') {
            tableauBlogs.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (sortByParam === 'createdAt') {
            tableauBlogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        if (sortByParam === 'updatedAt') {
            tableauBlogs.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        }
        if (sortByParam === 'comments') {
            tableauBlogs.sort((a, b) => a.comments.length - b.comments.length);
        }
        if (sortByParam === 'avgNote') {
            tableauBlogs.sort((a, b) => {
                const moyenneA = a.comments.reduce((total, c) => total + (c.note || 0), 0) / (a.comments.length || 1);
                const moyenneB = b.comments.reduce((total, c) => total + (c.note || 0), 0) / (b.comments.length || 1);
                return moyenneA - moyenneB;
            });
        }

        if (orderParam === 'desc') {
            tableauBlogs.reverse();
        }

        res.status(200).send(tableauBlogs);
    } catch (err) {
        res.status(500).send({ message: "Erreur serveur", error: err.message });
    }
}

async function complexSearch(req, res) {
    try {
        const authorName = req.query.author;
        const dateFrom = req.query.from;
        const dateTo = req.query.to;
        const commenterName = req.query.comments;

        const authorIds = await findUserIdsByNameFragment(authorName);

        const query = await Blog.find({
            author: { $in: authorIds },
            createdAt: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
            comments: { $elemMatch: { user: { $regex: commenterName, $options: 'i' } } }
        });

        res.status(200).send(query);
    } catch (err) {
        res.status(500).send({ message: "Erreur serveur", error: err.message });
    }
}

export default { getAllBlogs, createBlogWithPost, getId, getBlogsByName, updateBlog, deleteBlog, addComment, showComment, searchBlogs, complexSearch };