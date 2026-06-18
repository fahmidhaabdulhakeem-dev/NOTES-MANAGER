import express from 'express';
import cors from 'cors';
import { dbAll, dbGet, dbRun, dbInit } from './database.js';

const app = express();
const PORT = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// 1. Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await dbAll('SELECT * FROM notes ORDER BY updated_at DESC');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// 2. Get a single note by ID
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await dbGet('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// 3. Create a new note
app.post('/api/notes', async (req, res) => {
  const { title, content, category, color } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const result = await dbRun(
      'INSERT INTO notes (title, content, category, color) VALUES (?, ?, ?, ?)',
      [title, content, category || 'Personal', color || '#8b5cf6']
    );
    const newNote = await dbGet('SELECT * FROM notes WHERE id = ?', [result.id]);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// 4. Update an existing note
app.put('/api/notes/:id', async (req, res) => {
  const { title, content, category, color } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const note = await dbGet('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    await dbRun(
      `UPDATE notes 
       SET title = ?, content = ?, category = ?, color = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, content, category, color, req.params.id]
    );

    const updatedNote = await dbGet('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// 5. Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const note = await dbGet('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    await dbRun('DELETE FROM notes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Note deleted', id: Number(req.params.id) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Start the server after initializing database
dbInit()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });