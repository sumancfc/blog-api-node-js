const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const { errorHandler } = require("../middlewares/dbErrorHandler");

// Private user profile
exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  return res.status(200).json(req.profile);
};

// Get user profile
exports.userProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const getUser = await User.findOne({ username }).exec();

    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let user = getUser;

    const blog = await Blog.find({ postedBy: user._id })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      )
      .exec();

    user.photo = undefined;
    user.hashed_password = undefined;
    user.salt = undefined;

    res.status(200).json({ user, blogs: blog });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: errorHandler(err) });
  }
};

// Update user profile
exports.updateUserProfile = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "Photo could not be uploaded" });
    }

    let user = req.profile;
    user = _.extend(user, fields);

    if (fields.password && fields.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res
          .status(400)
          .json({ message: "Image should be less than 10MB" });
      }
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: "All fields required" });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      user.photo = undefined;
      res.status(200).json(user);
    });
  });
};

// Get user photo
exports.getUserPhoto = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.photo.data) {
      res.set("Content-Type", user.photo.contentType);
      return res.status(200).send(user.photo.data);
    } else {
      return res.status(404).json({ message: "Photo not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
