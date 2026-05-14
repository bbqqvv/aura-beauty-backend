const express = require('express');
const router = express.Router();
const blogController = require('../controller/blog.controller');

// add a blog
router.post('/add', blogController.addBlog);
// get all blogs
router.get('/all', blogController.getAllBlog);
// get single blog
router.get('/single-blog/:id', blogController.getSingleBlog);
// update blog
router.patch('/edit-blog/:id', blogController.updateBlog);
// delete blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
