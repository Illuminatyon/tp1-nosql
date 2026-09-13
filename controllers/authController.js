import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function signup(req, res){
    try {
        const nomUser = req.body.nom;
        const prenomUser = req.body.prenom;
        const emailUser = req.body.email;
        const usernameUser = req.body.username;
        const passwordUser = req.body.password;

        if(!nomUser || !prenomUser || !emailUser || !usernameUser || !passwordUser){
            return res.status(400).send({message: "Il manque des données pour l'inscription."});
        }

        const passwordHash = await bcrypt.hash(passwordUser, 8);

        const query = await User.create({nom: nomUser, prenom: prenomUser, email: emailUser, username: usernameUser, password: passwordHash});
        res.status(201).send({message: "Utilisateur créé avec succès.", id: query._id});
    } catch (err){
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

async function signin(req, res){
    try {
        const usernameUser = req.body.username;
        const passwordUser = req.body.password;

        if(!usernameUser || !passwordUser){
            return res.status(400).send({message: "Le nom d'utilisateur et le mot de passe sont requis."});
        }

        const user = await User.findOne({username: usernameUser});
        if(!user){
            return res.status(404).send({message: "Utilisateur introuvable."});
        }

        const motDePasseValide = await bcrypt.compare(passwordUser, user.password);
        if(!motDePasseValide){
            return res.status(401).send({message: "Mot de passe incorrect."});
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: 86400});

        res.status(200).send({id: user._id, username: user.username, token: token});
    } catch (err) {
        res.status(500).send({message: "Erreur serveur", error: err.message});
    }
}

export default { signup, signin };