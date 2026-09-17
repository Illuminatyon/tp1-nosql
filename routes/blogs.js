import express from 'express';
import blogController from '../controllers/blogController.js';
import authJwt from '../middlewares/authJwt.js';
const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.get('/search', blogController.searchBlogs);
router.get('/search/complex', blogController.complexSearch);
router.get('/author/:author', blogController.getBlogsByName);
router.get('/:id', blogController.getId);
router.post('/', authJwt.verifyToken, blogController.createBlogWithPost);
router.put('/:id', authJwt.verifyToken, blogController.updateBlog);
router.delete('/:id', authJwt.verifyToken, blogController.deleteBlog);
router.post('/:id/comments', authJwt.verifyToken, blogController.addComment);
router.get('/:id/comments', blogController.showComment);

export default router;