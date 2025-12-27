const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'simple_website',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const connection = await pool.getConnection();
    
    const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    await connection.execute(query, [name, email, message]);
    
    connection.release();

    res.json({ 
      message: 'Contact saved successfully',
      data: { name, email, message }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error saving contact' });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM contacts ORDER BY created_at DESC');
    connection.release();
    
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
