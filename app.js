const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const io = require('socket.io');

const feedRoutes = require('./routes/feed');
const signUpRoutes = require('./routes/auth');

const app = express();

let host = '127.0.0.1';
let port = 3003;
let DB_NAME = 'blog-api';
const MONGODB_URI = `mongodb://${host}/${DB_NAME}`


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})
const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('File type not Supported'), false)
    }
}

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');      // Resolving the CORS security error
    res.setHeader('Access-Control-Allow-Methods', '*');      // Defining Permitted HTTP verbs
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');      // Allowing Permitted Changing Headers in Requests
    next();
})

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
})

app.use(bodyParser.json());     // application/json
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload.single('image'));


app.use('/feed', feedRoutes);
app.use(signUpRoutes);

app.use((error, req, res, next) => {   // Error Handling Middleware
    console.log(error);

    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({
        message: message,
    })
})

mongoose.connect(MONGODB_URI)
    .then(() => {
        const server = app.listen(port, () => {
            console.log(`http://${host}:${port}/`);
        });
        const io = require('./socket').init(server);

        io.on("connection", () => {
            console.log("Client Connected to the Server");
        })
    })
    .catch(err => {
        console.log(err)
    })