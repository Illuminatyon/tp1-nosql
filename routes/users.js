import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router()

// Pour les utilisateurs
// Création utilisateur
router.post('/', userController.createUser);
// Modification utilisateur
router.put('/:id', userController.updateUser);
// Affichage de tous les utilisateurs
router.get('/', userController.showUsers);
// Suppression Utilisateur
router.delete('/:id', userController.deleteUser);
export default router;