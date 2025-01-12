const express = require("express");
const router = express.Router();

const { signup, signin, signout } = require("../controllers/auth");

const { runValidation } = require("../validators");
const {
  userSignupValidation,
  userSigninValidation,
} = require("../validators/auth");

/***
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API to manage Authentication
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user with name, email, and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password (min 6 characters, must include 1 digit)
 *     responses:
 *       201:
 *         description: Successfully created new user
 *       400:
 *         description: Validation error
 */
router.post("/signup", userSignupValidation, runValidation, signup);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticate a user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   description: User object (excluding sensitive information)
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email and Password do not match.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User with that email does not exist.
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email or password
 */
router.post("/signin", userSigninValidation, runValidation, signin);

/**
 * @swagger
 * /signout:
 *   get:
 *     summary: Sign out a user
 *     description: Clear the authentication token cookie to sign out the user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully signed out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signout success.
 *       500:
 *         description: Server error during signout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Signout failed.
 */
router.get("/signout", signout);

module.exports = router;
