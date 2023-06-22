import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
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
      res.status(200).send("You are loggend in");
    } else {
      res.status(401).json({
        succeded: false,
        err: "Password are not matched",
      });
    }
  } catch (err) {
    res.status(500).json({
      succeed: false,
      err,
    });
  }
};

export { createUser, loginUser };
