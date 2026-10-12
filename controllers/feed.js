const Post = require('../models/post');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const io = require('../socket');

exports.getAllPosts = async (req, res, next) => {

    try {

        const postList = await Post.find()
            .sort({createdAt: -1})
            .populate('creator')

        res.status(200).json({
            message: "Fetching Posts Successfully!",
            posts: postList,
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.createPost = async (req, res, next) => {

    const { title, content, image } = req.body

    const errors = validationResult(req);

    try {

        if (!errors.isEmpty()) {

            const error = new Error('داده ورودی نامعتبر میباشد');
            error.statusCode = 422;
            throw error;
        }

        if (!req.file) {
            const error = new Error('Please upload a file')
            error.statusCode = 422;
            throw error;
        }

        const newPost = new Post({
            title: title,
            content: content,
            imageUrl: "images/" + req.file.filename,
            creator: req.userId,
        })
        const postResult = await newPost.save();

        const user = await User.findById(req.userId);
        user.posts.push(postResult);

        const creator = await user.save();

        io.getIO().emit('post', {
            action: 'create',
            post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
        });

        res.status(201).json({
            message: "Post created Successfully!",
            post: postResult,
            creator: creator,
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSinglePost = async (req, res, next) => {

    const postId = req.params.postId;

    try {

        const post = await Post.findById(postId).populate('creator');
        if (!post) {
            const error = new Error("Post not Found!")
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: "Post Fetched",
            post: post,
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updatePost = async (req, res, next) => {

    const { postId } = req.params;
    const { title, content } = req.body;

    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {

            const error = new Error('داده ورودی نامعتبر میباشد');
            error.statusCode = 422;
            throw error;
        }

        const post = await Post.findById(postId).populate('creator');

        if (!post) {
            const error = new Error("Could not find post")
            error.statusCode = 404;
            throw error;
        }

        // Authorization
        if (post.creator._id.toString() !== req.userId) {     // Authorizing User who wand edit post
            const error = new Error('Not authorized')
            error.statusCode = 403;
            throw error;
        }

        post.title = title;
        post.content = content;

        if (req.file) {

            const oldImage = post.imageUrl;

            post.imageUrl = 'images/' + req.file.filename;

            if (oldImage) {
                await clearImage(oldImage);
            }
        }

        const result = await post.save();

        io.getIO().emit('post', {
            action: 'update',
            post: result,
        })

        res.status(200).json({
            message: "Post Updated Successfully",
            post: post,
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deletePost = async (req, res, next) => {

    const postId = req.params.postId;
    try {

        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('Could not find post')
            error.statusCode = 404;
            throw error;
        }

        // Authorization
        if (post.creator.toString() !== req.userId) {     // Authorizing User who wand delete post
            const error = new Error('Not authorized')
            error.statusCode = 403;
            throw error;
        }

        clearImage(post.imageUrl)
        const deletedPost = await Post.findByIdAndDelete(postId);

        const user = await User.findById(req.userId)
        user.posts.pull(new mongoose.Types.ObjectId(postId));   // Casting String id to Object id
        await user.save();

        io.getIO().emit('post', {
            action: 'delete',
            post: postId,
        })

        res.status(200).json({
            post: deletedPost,
            message: 'Post deleted Successfully',
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


const clearImage = async (filePath) => {

    newFilePath = path.join(__dirname, '..', 'public', filePath);
    if (await fs.existsSync(newFilePath)) {
        await fs.unlinkSync(newFilePath, (err) => {
            throw err;
        })
        console.log("Image deleted Successfully");
    } else {
        console.log("Image not Found");
    }
}