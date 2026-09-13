import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema ({
    nom: String,
    prenom: String,
    email: String,
    username: String
});

const User = model('User', userSchema);

export default User;