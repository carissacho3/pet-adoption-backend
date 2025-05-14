const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const userRoutes = require('./route/userRoute');
app.use('/api/users', userRoutes);

const petRoute = require('./route/petRoute');
app.use('/api/pets', petRoute);

mongoose.connect(process.env.MONGODB_CONN_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on port ${HTTP_PORT}`);
  });
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

app.get('/', (req, res) => {
  res.json({ message: "Welcome" });
});
