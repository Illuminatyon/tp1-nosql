import express from 'express';
import userController from '../controllers/userController.js';
import authJwt from '../middlewares/authJwt.js';
const router = express.Router()

// Pour les utilisateurs
// Modification utilisateur
router.put('/:id', authJwt.verifyToken, userController.updateUser);
// Affichage de tous les utilisateurs
router.get('/', userController.showUsers);
// Suppression Utilisateur
router.delete('/:id', authJwt.verifyToken, userController.deleteUser);
// Affichage des commentaires d'un utilisateur
router.get('/:id/comments', userController.commentsUser);
export default router;