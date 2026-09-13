import express from 'express';
import blogController from '../controllers/blogController.js'
const router = express.Router()

/*router.get('/', (req, res) =>
	res.status(200).send("Coucou")
)*/
// Pour les blogs

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getId);
router.post('/', blogController.createBlogWithPost);
router.get('/author/:author', blogController.getBlogsByName);
// pour modifier un article
router.put('/:id', blogController.updateBlog);
// pour supprimer un article
router.delete('/:id', blogController.deleteBlog);
// pour ajouter un commentaire
router.post('/:id', blogController.addComment);
router.get('/comments/:id', blogController.showComment);
export default router;
