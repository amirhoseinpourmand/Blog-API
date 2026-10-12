const User = require('../models/user');

const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postSignup = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: "Validation failed; Entered data is Invalid",
                errors: errors.array(),
            })
        }

        const { email, password, name } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(422).json({
                message: 'User already exists!'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword,
            name: name
        });
        const registerResult = await user.save();

        res.status(201).json({
            userId: registerResult._id,
            message: 'User created successfully!'
        });

    } catch (err) {

        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.postLogin = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: "Validation failed; Entered data is Invalid",
                errors: errors.array(),
            })
        }
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Email not Found!!'
            });
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            return res.status(401).json({
                message: 'Password is Wrong!'
            });
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            'Amir2004',
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            token: token,
            userId: user._id.toString()
        });

    } catch (err) {
        next(err);
    }
};