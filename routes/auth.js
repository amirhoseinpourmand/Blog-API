const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup',
    [
        body('email')
            .trim()
            .isEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .isLength({ min: 3 })
            .notEmpty(),
    ]
    , authController.postSignup);

router.post('/login',
    [
        body('email')
            .trim()
            .isEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
    ]
    , authController.postLogin);


module.exports = router;