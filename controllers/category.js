const Category = require("../models/categoryModel");
const Blog = require("../models/blogModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

// Create category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    return res.status(400).json({ error: "Category already exists." });
  }

  const slug = slugify(name).toLowerCase();

  const category = new Category({ name, slug });
  await category.save();

  if (category) {
    return res.status(201).json(category);
  } else {
    return res.status(500).json({ error: "Failed to create category!" });
  }
});

// Get all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
  res.status(200).json(categories);
});

// Get single category
exports.getSingleCategory = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  const category = await Category.findOne({ slug }).exec();

  if (!category) {
    return res
      .status(404)
      .json({ error: "Category not found or already deleted!" });
  }

  const data = await Blog.find({ categories: category })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec();

  res.status(200).json({ category, blogs: data });
});

// Update category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const categoryExists = await Category.findById(id);

  if (!categoryExists) {
    return res.status(404).json({ error: "Category not found." });
  }

  const slug = slugify(name).toLowerCase();
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name, slug },
    { new: true }
  );

  res.status(200).json(updatedCategory);
});

// Delete category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndRemove(id);

  if (!category) {
    return res
      .status(404)
      .json({ error: "Category not found or already deleted!" });
  }

  res.status(200).json({ message: "Category deleted successfully" });
});
