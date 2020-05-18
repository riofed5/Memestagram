'use strict';
// catRoute
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.user_list_get);
router.get('/:name', userController.user_get);

router.put('/user', (req, res) => {
    res.send('With this endpoint you can edit users.');
});
router.delete('/user', (req, res) => {
    res.send('With this endpoint you can delete users.');
});

module.exports = router;