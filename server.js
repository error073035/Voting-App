const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectToDB = require('./db/connection');
connectToDB();

app.get('/', (req, res) => {
  res.send("Welcome to the Voting Application");
})

app.use(express.json());
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

const candidateRouter = require('./routes/candidate.routes');
app.use('/api/candidates', candidateRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
})