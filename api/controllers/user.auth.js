import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Generate a random salt.
  const salt = bcrypt.genSaltSync(10);
  const hashpassword = await bcrypt.hashSync(password, salt);

  const newUser = new User({ username, email, password: hashpassword });
  try {
    await newUser.save();
    res.status(201).json("user created sucessfully");
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { email } = req.body;
  try {
    const validuser = await User.findOne({ email });
    if (!validuser) return next(errorHandler(404, "user not found"));
    const validpassword = bcrypt.compareSync(
      req.body.password,
      validuser.password
    );
    if (!validpassword) return next(errorHandler(400, "invalid password"));
    const token = jwt.sign({ id: validuser._id }, process.env.Secretkey);
    const { password, ...rest } = validuser._doc; // _doc is the document object
    res.cookie("access_token", token, {
      httpOnly: true,
    });
    res.status(200).json(rest);
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

const googleAuth = async (req, res, next) => {
  const { name, email, imageurl } = req.body;
  try {
    const validuser = await User.findOne({ email });
    if (validuser) {
      const token = jwt.sign({ id: validuser._id }, process.env.Secretkey);
      const { password, ...rest } = validuser._doc; // _doc is the document object
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      res.status(200).json(rest);
    } else {
      const newpassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      // Generate a random salt.
      const salt = bcrypt.genSaltSync(10);
      const hashpassword = await bcrypt.hashSync(newpassword, salt);
      const newUser = new User({
        username: name,
        email,
        password: hashpassword,
        profilepic: imageurl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.Secretkey);
      const { password, ...rest } = newUser._doc; // _doc is the document object
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      res.status(200).json(rest);
    }
  } catch (err) {
    next(err);
  }
};
export { signup, signin, googleAuth};
