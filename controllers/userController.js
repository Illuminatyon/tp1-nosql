import User from '../models/User.js';

async function createUser(req, res) {
    // gérer les cas ou il manque des éléments
    try {
        const userName = req.body.nom;
        const userLastName = req.body.prenom;
        const userEmail = req.body.email;
        const userOnlineName = req.body.username;
        const query = await User.insertOne({nom: userName, prenom: userLastName, email: userEmail, username: userOnlineName});
        if(query){
            res.status(200).send("Un utilisateur à été ajouté.");
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

async function updateUser(req, res) {
    // todo: même chose aussi ici, et faire la même pour le reste du projet par ailleurs
    try {
        const nomUpdate = req.body.nom;
        const prenomUpdate = req.body.prenom;
        const emailUpdate = req.body.email;
        const usernameUpdate = req.body.username;
        const query = await User.update({_id: id},{$set: {
            nom: nomUpdate,
            prenom: prenomUpdate,
            email: emailUpdate,
            username: usernameUpdate
            }});
        if(query){
            res.status(200).send("Un utilisateur à été mis à jour.");
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

async function showUsers(req, res){
    try {
        const query = await User.find();
        if(query){
            res.status(200).send(query);
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

async function deleteUser(req, res) {
    try {
        const idUser = req.params.id;
        const query = await User.deleteOne({_id: idUser});
        if(query){
            res.status(200).send("Un utilisateur à été supprimé.");
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

export default { createUser, updateUser, showUsers, deleteUser};