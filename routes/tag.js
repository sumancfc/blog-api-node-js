const express = require("express");

const router = express.Router();

const {
  createTag,
  getAllTags,
  getSingleTag,
  updateTag,
  deleteTag,
} = require("../controllers/tag");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

const { tagValidation } = require("../validators/tag");
const { runValidation } = require("../validators");

/***
 * @swagger
 * tags:
 *   name: Tags
 *   description: API to manage tags
 */

/**
 * @swagger
 * /tag:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created tag
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/tag",
  tagValidation,
  runValidation,
  requireSignin,
  adminMiddleware,
  createTag
);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all Tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Successfully retrieved tags
 */
router.get("/tags", getAllTags);

/**
 * @swagger
 * /tag/{slug}:
 *   get:
 *     summary: Get a single tag by slug
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of tag
 *     responses:
 *       200:
 *         description: Successfully retrived single tag
 *       404:
 *         description: Tag not found
 */
router.get("/tag/:slug", getSingleTag);

/**
 * @swagger
 * /tag/{id}:
 *   put:
 *     summary: Update a tag by ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Id of the tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated tag
 *       404:
 *         description: Tag not found
 *       401:
 *         description: Unauthorized
 */
router.put("/tag/:id", requireSignin, adminMiddleware, updateTag);

/**
 * @swagger
 * /tag/{id}:
 *   delete:
 *     summary: Delete a tag by ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the tag
 *     responses:
 *       200:
 *         description: Successfully deleted tag
 *       404:
 *         description: Tag not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/tag/:id", requireSignin, adminMiddleware, deleteTag);

module.exports = router;
