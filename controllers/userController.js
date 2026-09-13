import User from '../models/User.js';
import Blog from "../models/blog.js";

async function createUser(req, res){
    try {
        const nomUser = req.body.nom;
        const prenomUser = req.body.prenom;
        const emailUser = req.body.email;
        const usernameUser = req.body.username;

        if(!nomUser || !prenomUser || !emailUser || !usernameUser){
            return res.status(400).send({message: "Il manque des données pour l'ajout d'un nouvel utilisateur."});
        }
        const query = await User.create({nom: nomUser, prenom: prenomUser, email: emailUser, username: usernameUser});
        res.status(201).send(query);
    } catch (err){
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function updateUser(req, res){
    try {
        const idUserUpdate = req.params.id;

        const nomUser = req.body.nom;
        const prenomUser = req.body.prenom;
        const email = req.body.email;
        const usernameUser = req.body.username;

        const updateFields = {};
        if (nomUser){
            updateFields.nom = nomUser;
        }
        if (prenomUser) {
            updateFields.prenom = prenomUser;
        }
        if (email) {
            updateFields.email = email;
        }
        if (usernameUser) {
            updateFields.username = usernameUser;
        }

        const query = await User.findByIdAndUpdate(idUserUpdate, {$set: updateFields}, {new: true});
        if(!query){
            return res.status(404).send("Le document est introuvable.");
        }
        res.status(200).send(query);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function showUsers(req, res){
    try {
        const sortByParam = req.query.sortBy;
        const orderParam = req.query.order;

        const query = await User.find();

        if (sortByParam === 'nom') {
            query.sort((a, b) => a.nom.localeCompare(b.nom));
        }
        if (sortByParam === 'createdAt') {
            query.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        if (sortByParam === 'comments') {
            const tableauBlogs = await Blog.find();
            const resultat = [];

            for (const user of query) {
                let nombreCommentaires = 0;
                for (const blog of tableauBlogs) {
                    for (const comment of blog.comments) {
                        if (comment.user === user.username) {
                            nombreCommentaires++;
                        }
                    }
                }
                const userObjet = user.toObject();
                userObjet.commentCount = nombreCommentaires;
                resultat.push(userObjet);
            }

            resultat.sort((a, b) => a.commentCount - b.commentCount);
            if (orderParam === 'desc') {
                resultat.reverse();
            }
            return res.status(200).send(resultat);
        }

        if (orderParam === 'desc') {
            query.reverse();
        }

        res.status(200).send(query);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function deleteUser(req, res){
    try {
        const idUserDeleted = req.params.id;
        const query = await User.findByIdAndDelete(idUserDeleted);
        if(!query){
            return res.status(404).send("Le document est introuvable.");
        }
        res.status(200).send(query);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function commentsUser(req, res){
    try {
        const idUser = req.params.id;

        const user = await User.findById(idUser, { username: 1 });
        if (!user) {
            return res.status(404).send({ message: "Utilisateur introuvable." });
        }
        const blogs = await Blog.find(
            { "comments.user": user.username },
            { title: 1, comments: 1 }
        );

        const comments = blogs.flatMap(blog =>
            blog.comments
                .filter(c => c.user === user.username)
                .map(c => ({ blogId: blog._id, blogTitle: blog.title, content: c.content, note: c.note }))
        );

        res.status(200).send(comments);
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}


export default { createUser, updateUser, showUsers, deleteUser, commentsUser};