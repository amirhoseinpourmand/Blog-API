# Blog API

A RESTful backend for a blog application built with **Node.js**, **Express**, and **MongoDB**. It supports user registration and login, authenticated post management, image uploads, and Socket.IO events intended to notify connected clients when posts change.

## Features

- User registration and login
- Password hashing with `bcrypt`
- JSON Web Token (JWT) authentication
- Create, read, update, and delete blog posts
- Associate posts with their authors
- Upload images for posts
- Validate selected request fields with `express-validator`
- Serve uploaded images from the `public` directory
- Socket.IO integration for post-change events
- MongoDB persistence through Mongoose

## Project Structure

```text
Project/
├── app.js
├── socket.js
├── controllers/
│   ├── auth.js
│   └── feed.js
├── middlewares/
│   └── verifyToken.js
├── models/
│   ├── post.js
│   └── user.js
├── routes/
│   ├── auth.js
│   └── feed.js
├── public/
│   └── images/
├── package.json
└── README.md
```

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- npm (included with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/amirhoseinpourmand/blog-api
cd blog-api
```

Replace the placeholders with your repository URL and directory name.

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

The current application connects to a local MongoDB instance at `127.0.0.1` and uses a database named `blog-api`. Make sure MongoDB is running before starting the API.

### 4. Start the server

The project currently does not define a `start` script in `package.json`, so run:

```bash
node app.js
```

The server listens at:

```text
http://127.0.0.1:3003
```

> Configuration note: the MongoDB address, database name, server host, port, and JWT secret are currently hard-coded in the source. For deployment, move these values into environment variables and keep secrets out of version control.

Requires authentication and ownership of the post.

### Endpoint Summary

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `POST` | `/signup` | No | Register a user |
| `POST` | `/login` | No | Log in |
| `GET` | `/feed/posts` | Yes | Get all posts |
| `POST` | `/feed/post` | Yes | Create a post with an image |
| `GET` | `/feed/post/:postId` | Yes | Get a post by ID |
| `PUT` | `/feed/post/:postId` | Yes | Update a post |
| `DELETE` | `/feed/post/:postId` | Yes | Delete a post |

## Real-Time Events

The application initializes Socket.IO when the MongoDB connection succeeds. The feed controller is designed to emit a `post` event when a post is created, updated, or deleted. Event payloads include an `action` such as `create`, `update`, or `delete`.

The Socket.IO server currently allows a frontend origin of `http://localhost:3000`. Review this setting for your own frontend and deployment environment.

## Data Models

### User

The user model includes:

- `name`
- `email`
- `password` (hashed)
- `status` (defaults to `new user`)
- `posts` (references to posts created by the user)

### Post

The post model includes:

- `title`
- `content`
- `imageUrl` (optional image path)
- `creator` (reference to the author)
- `createdAt` and `updatedAt` (Mongoose timestamps)

## Error Handling

The API returns JSON error responses with a `message` field for errors handled by the application. Depending on the situation, relevant HTTP status codes include:

- `401 Unauthorized` — missing or invalid authentication credentials
- `403 Forbidden` — attempting to modify a post owned by another user
- `404 Not Found` — requested post does not exist
- `422 Unprocessable Entity` — invalid input or missing required upload
- `500 Internal Server Error` — unexpected server error

## Current Limitations and Security Notes

Before using this project in production, consider addressing the following:

- Move the JWT secret and database configuration to environment variables. The JWT secret is currently hard-coded in the source and should be changed.
- The authentication middleware currently expects the token directly in `Authorization`; consider adopting the standard `Bearer <token>` format.
- Review the Socket.IO post-creation handler and test all real-time events end to end.
- Add automated tests and define useful `start` and `dev` scripts in `package.json`.
- Review CORS configuration and restrict allowed origins to trusted frontend applications.
- Check and correct model validation rules and add appropriate validation for all fields.
- Ensure that runtime dependencies such as Express and bcrypt are listed under `dependencies`, not `devDependencies`.

## Scripts

No application start or test script is currently configured in `package.json`. Start the server with `node app.js`. The existing `npm test` script is a placeholder and does not run tests.

## License

The package currently declares the **ISC** license. Add a `LICENSE` file to the repository if you intend to distribute the project under that license.
