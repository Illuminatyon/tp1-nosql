import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function signup(req, res) {
    try {
        const { nom, prenom, email, username, password } = req.body;

        if (!nom || !prenom || !email || !username || !password) {
            return res.status(400).send({ message: "Il manque des données pour l'inscription." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ nom, prenom, email, username, password: passwordHash });

        res.status(201).send({ message: "Utilisateur créé avec succès.", id: user._id });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).send({ message: "Cet email ou nom d'utilisateur existe déjà." });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).send({ message: "Données d'inscription invalides.", error: err.message });
        }
        res.status(500).send({ message: "Erreur serveur", error: err.message });
    }
}

async function signin(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ message: "Le nom d'utilisateur et le mot de passe sont requis." });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send({ message: "Identifiants incorrects." });
        }

        const motDePasseValide = await bcrypt.compare(password, user.password);
        if (!motDePasseValide) {
            return res.status(401).send({ message: "Identifiants incorrects." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).send({ id: user._id, username: user.username, token });
    } catch (err) {
        res.status(500).send({ message: "Erreur serveur", error: err.message });
    }
}

export default { signup, signin };