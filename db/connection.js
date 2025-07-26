const mongoose = require('mongoose');

function connectToDB() {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log("Connected to DB");
    })
    .catch(() => {
      console.log("Something went wrong");
    })
} 

module.exports = connectToDB;