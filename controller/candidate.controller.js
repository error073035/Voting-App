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

const voteCandidate = async (req, res) => {
  const candidateId = req.params.id;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    if (user.isvoted) {
      return res.status(403).json({
        message: "You have already voted"
      });
    }
    if (user.role == 'admin') {
      return res.status(403).json({
        message: "Admins cannot vote"
      });
    }
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }
    candidate.votes.push({ user: userId });
    candidate.votecount += 1;
    await candidate.save();

    user.isvoted = true;
    await user.save();
    res.status(200).json({
      message: "Vote cast successfully"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

const voteCount = async (req, res) => {
  try {

    const candidate = await Candidate.find().sort({ voteCount: 'desc' });

    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.votecount
      }
    })

    res.status(200).json({
      message: "Vote count retrieved successfully",
      voteCount: voteRecord
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
  deleteCandidate,
  voteCandidate,
  voteCount
};