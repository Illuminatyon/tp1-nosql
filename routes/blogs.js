import express from 'express';
import blogController from '../controllers/blogController.js'
import authJwt from '../middlewares/authJwt.js';
const router = express.Router()

/*router.get('/', (req, res) =>
    res.status(200).send("Coucou")
)*/
// Pour les blogs

router.get('/', blogController.getAllBlogs);
router.get('/search', blogController.searchBlogs);
router.get('/search/complex', blogController.complexSearch);
router.get('/:id', blogController.getId);
router.post('/', authJwt.verifyToken, blogController.createBlogWithPost);
router.get('/author/:author', blogController.getBlogsByName);
// pour modifier un article
router.put('/:id', authJwt.verifyToken, blogController.updateBlog);
// pour supprimer un article
router.delete('/:id', authJwt.verifyToken, blogController.deleteBlog);
// pour ajouter un commentaire
router.post('/:id', authJwt.verifyToken, blogController.addComment);
router.get('/comments/:id', blogController.showComment);
export default router;