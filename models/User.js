import mongoose from 'mongoose';

const { Schema, model } = mongoose;


const userSchema = new Schema({
    nom: { type: String, required: [true, "Le nom est requis."] },
    prenom: { type: String, required: [true, "Le prénom est requis."] },
    email: {
        type: String,
        required: [true, "L'email est requis."],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Email invalide."]
    },
    username: {
        type: String,
        required: [true, "Le nom d'utilisateur est requis."],
        unique: true,
        minlength: [3, "Le nom d'utilisateur doit faire au moins 3 caractères."]
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis."],
        minlength: [6, "Le mot de passe doit faire au moins 6 caractères."]
    },
    createdAt: { type: Date, default: Date.now }
})

const User = model('User', userSchema);

export default User;