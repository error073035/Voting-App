const { json, response } = require('express');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwt.middlewares');

const registerUser = async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    console.log(response);
    //jwt
    const payload = {
      id: response.id
    }
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token: ", token);
    res.status(201).json({ message: "User registered successfully", user: response });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

const loginUser = async (req, res) => {
  try {
    const { adhaarnumber, password } = req.body;
    const user = await User.findOne({ adhaarnumber: adhaarnumber })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = {
      id: user.id
    }
    const token = generateToken(payload);
    res.json(token);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const profileUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Requested userId:", userId);
    const user = await User.findById(userId);
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: user
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword and newPassword are required" });
    }
    const user = await User.findById(userId);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid username and password" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { registerUser, loginUser, profileUser, changePassword };