const Tag = require("../models/tagModel");
const Blog = require("../models/blogModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { errorHandler } = require("../middlewares/dbErrorHandler");

// Create tag
exports.createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const tagExists = await Tag.findOne({ name });

  if (tagExists) {
    return res.status(400).json({ error: "Tag already exists" });
  }

  const slug = slugify(name).toLowerCase();
  const tag = new Tag({ name, slug });
  await tag.save();

  if (tag) {
    return res.status(201).json(tag);
  } else {
    return res.status(500).json({ error: "Failed to create tag" });
  }
});

// Get all tags
exports.getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find({}).sort({ createdAt: -1 }).exec();
  res.status(200).json(tags);
});

// Get single tag
exports.getSingleTag = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  const tag = await Tag.findOne({ slug }).exec();

  if (!tag) {
    return res.status(404).json({ error: "Tag not found or already deleted!" });
  }

  const data = await Blog.find({ tags: tag })
    .populate("tags", "_id name slug")
    .populate("categories", "_id name slug")
    .populate("postedBy", "_id name")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec();

  if (!data) {
    return res.status(404).json({ error: "Data not found" });
  }

  res.status(200).json({ tag, blogs: data });
});

// Update tag
exports.updateTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const tagExists = await Tag.findById(id);

  if (!tagExists) {
    return res.status(404).json({ error: "Tag not found" });
  }

  const slug = slugify(name).toLowerCase();
  const updatedTag = await Tag.findByIdAndUpdate(
    id,
    { name, slug },
    { new: true }
  );

  res.status(200).json(updatedTag);
});

// Delete tag
exports.deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findByIdAndRemove(id);

  if (!tag) {
    return res.status(404).json({ error: "Tag not found or already deleted!" });
  }

  res.status(200).json({ message: "Tag deleted successfully" });
});
