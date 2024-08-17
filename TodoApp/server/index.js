require('dotenv').config();
const express = require('express');
const { connectToMongodb } = require('./database');
const app = express();
const router = require('./route');

app.use(express.json());
app.use('/api', router);

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectToMongodb();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
