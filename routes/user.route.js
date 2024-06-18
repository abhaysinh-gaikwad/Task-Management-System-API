require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model");
const { blacklistModel } = require("../model/blacklist.model");
const { auth } = require("../middleware/auth");
const userRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email
 *         password:
 *           type: string
 *           description: User's password
 *         confirmPassword:
 *           type: string
 *           description: User's confirm password
 *       example:
 *         email: user@example.com
 *         password: pass1234
 *         confirmPassword: pass1234
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Registers a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *       200:
 *         description: User already exists
 *       501:
 *         description: Passwords do not match or error during hashing
 */
userRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const Exuser = await UserModel.findOne({ email });
    if (Exuser) {
      res.status(200).send({ msg: "User is already registered, please login" });
    } else {
        bcrypt.hash(password, 8, async (err, hash) => {
          if (err) {
            console.error(err);
            res.status(501).send({ Error: "Error occurred while hashing the password" });
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
 *     summary: Logs in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Login successful
 *       501:
 *         description: Wrong password
 *       200:
 *         description: User not registered
 */
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userId: user._id }, `${process.env.JWT_SECRET}`, { expiresIn: "3d" });
          const refreshToken = jwt.sign({ userId: user._id }, `${process.env.REFRESH_JWT_SECRET}`, { expiresIn: "24h" });
          res.status(201).send({ msg: "Login successful", token, refreshToken });
        } else {
          res.status(501).send({ msg: "Wrong password" });
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
 *     summary: Logs out a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: An error occurred during logout
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
