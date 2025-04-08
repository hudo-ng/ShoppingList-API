//@ts-nocheck
import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const authRoute = Router();

// @ts-ignore
authRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Name and password required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentails" });
    }

    const isMatched = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatched) {
      res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, password: user.hashedPassword },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

authRoute.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    res.status(400).send({ message: "All fields required!" });
  }
  try {
    const ifRepeatedEmail = await User.findOne({ email });
    if (ifRepeatedEmail) {
      res.status(400).send({ message: "Email has been used" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      hashedPassword,
      phone,
    });
    await newUser.save();
    res.status(201).send({ message: "Register successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
