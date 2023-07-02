import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Photo from "../models/photoModel.js";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user: user._id });
  } catch (err) {
    let errors2 = {};

    if (err.code === 11000) {
      errors2.email = "The email is already registered";
    }

    if (err.name === "ValidationError") {
      Object.keys(err.errors).forEach((key) => {
        errors2[key] = err.errors[key].message;
      });
    }

    console.log("ERRORS2:::", errors2);

    res.status(400).json(errors2);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    let same = false;

    if (user) {
      same = await bcrypt.compare(password, user.password);
    } else {
      return res.status(401).json({
        succeed: false,
        err: "There is no such user",
      });
    }

    if (same) {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.redirect("/users/dashboard");
    } else {
      res.status(401).json({
        succeded: false,
        err: "Passwords are not matched",
      });
    }
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const getDashboardPage = async (req, res) => {
  const photos = await Photo.find({ user: res.locals.user._id });
  const user = await User.findById({ _id: res.locals.user._id }).populate([
    "followings",
    "followers",
  ]);
  res.render("dashboard", {
    link: "dashboard",
    photos,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: res.locals.user._id } });
    res.status(201).render("users", {
      users,
      link: "users",
    });
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    const photos = await Photo.find({ user: user._id });
    res.status(201).render("user", {
      user,
      photos,
      link: "user",
    });
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

const follow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { followers: res.locals.user._id } },
      { new: true }
    );

    user = await User.findByIdAndUpdate(
      {
        _id: res.locals.user._id,
      },
      { $push: { following: res.params.id } },
      { new: true }
    );

    res.status(200).json({
      succeded: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

const unfollow = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { followers: res.locals.user._id } },
      { new: true }
    );

    user = await User.findByIdAndUpdate(
      {
        _id: res.locals.user._id,
      },
      { $pull: { following: res.params.id } },
      { new: true }
    );

    res.status(200).json({
      succeded: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

export {
  createUser,
  loginUser,
  getDashboardPage,
  getAllUsers,
  getUser,
  follow,
  unfollow,
};
