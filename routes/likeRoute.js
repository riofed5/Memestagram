//Like routes
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.post('/:postId/:ownerId', likeController.image_like_click);
router.get('/:postId', likeController.image_get_like);
router.get('/top/likes', likeController.most_likes);

module.exports = router;