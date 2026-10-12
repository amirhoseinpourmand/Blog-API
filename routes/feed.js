const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isVerify = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/posts', isVerify, feedController.getAllPosts);

router.post('/post', isVerify,
    [
        body('title')
            .trim()
            .isLength({ min: 4 }),
        body('content')
            .trim()
            .isLength({ min: 4 })
    ]
    , feedController.createPost);


router.get('/post/:postId', isVerify, feedController.getSinglePost)

router.put('/post/:postId', isVerify, feedController.updatePost);

router.delete('/post/:postId', isVerify, feedController.deletePost);

module.exports = router;