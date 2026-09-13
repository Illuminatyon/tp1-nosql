import User from '../models/user';
import Blog from '../models/blog';

async function createUser(req, res){
    try {
        const nomUser = req.body.nom;
        const prenomUser = req.body.prenom;
        const emailUser = req.body.email;
        const usernameUser = req.body.username;

        if(!nomUser || !prenomUser || !emailUser || !usernameUser){
            res.status(404).send({message: "Il manque des données pour l'ajout d'un nouvel utilisateur."});
        }
        const query = await User.insertOne({nom: nomUser, prenom: prenomUser, email: emailUser, username: usernameUser});
        if(!query){
            res.status(500).send({message : "Erreur serveur.", error: err});
        }
        res.status(200).send(query);
    } catch (err){
        res.status(500).send({message: err});
    }
}

async function updateUser(req, res){
    try {
        const idUserUpdate = req.params.id;

        const nomUser = req.body.nom;
        const prenomUser = req.body.prenom;
        const email = req.body.email;
        const usernameUser = req.body.password;

        const query = await Blog.findByIdAndUpdate({_id: idUserUpdate}, {nom: nomUser, prenom: prenomUser, email: email, username: usernameUser}, {$new: true});
        if(!query){
            res.status(404).send("Le document est introuvable.");
        }
        res.status(200).send(query);
    } catch (err) {
        res.status(500).send({message: err});
    }
}

async function showUsers(req, res){
    try {
        const query = await Blog.find();
        res.status(200).send(query);
    } catch (err) {
        res.status(500).send({message: err});
    }
}

async function deleteUser(req, res){
    try {
        const idUserDeleted = req.params.id;
        const query = await Blog.findByIdAndDelete(idUserDeleted);
        if(!query){
            res.status(404).send("Le document est introuvable.");
        }
        res.status(200).send(query);
    } catch (err) {
        res.status(500).send({message: err});
    }
}

export default { createUser, updateUser, showUsers, deleteUser };