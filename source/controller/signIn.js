import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email.includes("@") || password.length < 6 || !/\d/.test(password)) {
    return res.status(400).json({
      message:
        "Please provide correct email, password needs to be atleast 6 symbols with one number included",
    });
  }

  const capFirstName = name.charAt(0).toUpperCase() + name.slice(1);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      uuid: uuidv4(),
      name: capFirstName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.uuid }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(201).json({
      message: "Registration successful",
      jwt_token: token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Bad email or password" });
    }

    const token = jwt.sign({ userId: user.uuid }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(200).json({
      message: "Login successful",
      jwt_token: token,
      uuid: user.uuid,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Auth failed", error: err.message });
  }
};

export const validateUser = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ mesage: "No token proviced" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(200).json({
      message: "Token is valid",
      token: token,
    });
  });
};
