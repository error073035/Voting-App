const mongoose = require('mongoose');
const candidateSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      votedAt: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  votecount: {
    type: Number,
    default: 0
  }
})

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;