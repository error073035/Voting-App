const { json, response } = require('express');
const Candidate = require('../models/candidate.model');
const jwt = require('jsonwebtoken');
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwt.middlewares');
const User = require('../models/user.model');

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === 'admin';
  } catch (err) {
    return false;
  }
}

const createCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) return res.status(403).json({ message: "user has not admin role" });
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    res.status(201).json({
      message: "Candidate created successfully",
      candidate: response
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
}

const updateCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) return res.status(403).json({ message: "user has not admin role" });

    const candidateId = req.params.id;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
      new: true,
      runValidators: true
    })
    if (!response) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }
    res.status(200).json({
      message: "Candidate updated successfully",
      candidate: response
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

const deleteCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) return res.status(403).json({ message: "user has not admin role" });
    const candidateId = req.params.id;
    const response = await Candidate.findByIdAndDelete(candidateId);
    if (!response) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }
    res.status(200).json({
      message: "Candidate deleted successfully"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

module.exports = {
  createCandidate,
  updateCandidate,
  deleteCandidate
};