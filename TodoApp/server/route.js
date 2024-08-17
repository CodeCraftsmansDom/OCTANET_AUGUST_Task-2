const express = require('express');
const { getConnectedClient } = require('./database');
const { ObjectId } = require('mongodb');
const router = express.Router();

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db('todosdb').collection('todos');
  return collection;
};

// GET request for displaying the todos
router.get('/todos', async (req, res) => {
  const collection = getCollection();
  try {
    const todos = await collection.find().toArray();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving todos', error: err.message });
  }
});

// POST request for creating a new todo
router.post('/todos', async (req, res) => {
  const collection = getCollection();
  const { todo } = req.body;
  try {
    const todoData = await collection.insertOne({ todo, status: false });
    res.status(201).json({ todo, status: false, _id: todoData.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating todo', error: err.message });
  }
});

// PUT request for updating a specific todo by ID
router.put('/todos/:id', async (req, res) => {
  const collection = getCollection();
  const { id } = req.params;
  const { status, todo } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, todo } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    const updatedTodo = await collection.findOne({ _id: new ObjectId(id) });
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Error updating todo', error: err.message });
  }
});

// DELETE request for deleting a specific todo by ID
router.delete('/todos/:id', async (req, res) => {
  const collection = getCollection();
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: `Todo with ID ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo', error: err.message });
  }
});

module.exports = router;
