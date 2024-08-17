require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client = null;

const connectToMongodb = async () => {
  if (!client) {
    try {
      client = new MongoClient(uri, options);
      await client.connect();
      console.log('Connected to MongoDB!');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    }
  }
  return client;
};

const getConnectedClient = () => client;

module.exports = { connectToMongodb, getConnectedClient };
