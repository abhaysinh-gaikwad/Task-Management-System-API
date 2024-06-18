const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");
const { blacklistModel } = require("../model/blacklist.model");
const { auth } = require("../middleware/auth");
const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user (hashed)
 *       example:
 *         username: john_doe
 *         email: john.doe@example.com
 *         password: mypassword
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '200':
 *         description: User is already registered, please login
 *       '400':
 *         description: Error occurred while registering user
 */

userRouter.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(200).send({ msg: "User is already registered, please login" });
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ Error: "Error occurred while hashing the password" });
                } else {
                    const user = new UserModel({
                        username,
                        email,
                        password: hash,
                    });
                    await user.save();
                    res.status(201).send({ msg: "User created", user });
                }
            });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ Error: "Error occurred while registering user" });
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *               password: mypassword
 *     responses:
 *       '201':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       '200':
 *         description: User is not registered, please sign up
 *       '500':
 *         description: Error occurred while logging in
 */

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
                    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_JWT_SECRET, { expiresIn: "24h" });
                    res.status(201).send({ msg: "Login successful", token, refreshToken });
                } else {
                    res.status(401).send({ msg: "Wrong password" });
                }
            });
        } else {
            res.status(200).send({ msg: "User is not registered, please sign up" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ Error: "Error occurred while logging in" });
    }
});

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Log out the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *       '500':
 *         description: An error occurred while logging out the user
 */

userRouter.get("/logout", auth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const blacklistToken = new blacklistModel({ token });
        await blacklistToken.save();
        res.status(200).send({ msg: "User logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "An error occurred while logging out the user" });
    }
});

module.exports = {
    userRouter,
};
