const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Member = require("../models/Member");

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecretkey";

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await Member.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Member already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Member({ username, password: hashedPassword, email });
    await newUser.save();

    const token = jwt.sign({ _id: newUser._id, username, email }, JWT_SECRET);

    res.status(201).json({ message: "Member registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Member.findOne({ username });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id, username, email: user.email },
      JWT_SECRET
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
