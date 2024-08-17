import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    fetchTodos();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (todo) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ todo }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to add todo');

      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id, status, todo) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, todo }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to update todo');

      const updatedTodo = await res.json();
      setTodos(todos.map((item) => (item._id === id ? updatedTodo : item)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });

      if (!res.ok) throw new Error('Failed to delete todo');

      setTodos(todos.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleUpdate = async () => {
    if (editContent.trim().length > 0) {
      await updateTodo(editTodoId, false, editContent);
      setEditTodoId(null);
      setEditContent("");
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.status;
    if (filter === 'done') return todo.status;
    return true; 
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`flex flex-col items-center p-6 min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'} font-roboto`}>
      <motion.button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-300 text-gray-900'} transition-colors`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDarkMode ? '🌙' : '☀️'}
      </motion.button>
      <h1 className="text-center text-4xl font-bold mb-6">Todo List</h1>

      <div className={`w-full max-w-md p-6 rounded-lg shadow-lg mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Add a new todo"
            className={`flex-1 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-4 py-2`}
          />
          <motion.button
            onClick={() => addTodo(editContent)}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${isDarkMode ? 'hover:bg-blue-400' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Add Todo
          </motion.button>
          {editTodoId && (
            <motion.button
              onClick={handleUpdate}
              className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 ${isDarkMode ? 'hover:bg-green-400' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Update Todo
            </motion.button>
          )}
        </div>
        <div className="flex space-x-4 mb-4">
          <motion.button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'} hover:bg-blue-600`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            All
          </motion.button>
          <motion.button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-900'} hover:bg-yellow-600`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Active
          </motion.button>
          <motion.button
            onClick={() => setFilter('done')}
            className={`px-4 py-2 rounded-lg ${filter === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-900'} hover:bg-green-600`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Done
          </motion.button>
        </div>
      </div>

      <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div key={todo._id} className="flex items-center justify-between p-2 border-b border-gray-300">
              <span
                className={`flex-1 ${todo.status ? 'line-through text-gray-500' : ''}`}
              >
                {todo.todo}
              </span>
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => updateTodo(todo._id, !todo.status, todo.todo)}
                  className="text-green-500 hover:text-green-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✔️
                </motion.button>
                <motion.button
                  onClick={() => {
                    setEditTodoId(todo._id);
                    setEditContent(todo.todo);
                  }}
                  className="text-yellow-500 hover:text-yellow-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✏️
                </motion.button>
                <motion.button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-500 hover:text-red-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  🗑️
                </motion.button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No todos available</p>
        )}
      </div>
    </div>
  );
};

export default App;
