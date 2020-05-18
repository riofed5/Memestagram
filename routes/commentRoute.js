//Comment routes
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:id', commentController.comment_get);
router.post('/', commentController.comment_create_post);

module.exports = router;