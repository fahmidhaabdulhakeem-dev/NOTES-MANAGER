import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'notes.db');

// Connect to SQLite database file
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Setup the table and seed initial note
export const dbInit = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT,
          category TEXT DEFAULT 'Personal',
          color TEXT DEFAULT '#8b5cf6',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return reject(err);

        // Check if there are any notes. If 0, insert a welcome note
        db.get('SELECT COUNT(*) as count FROM notes', (err, row) => {
          if (err) return reject(err);
          if (row && row.count === 0) {
            db.run(`
              INSERT INTO notes (title, content, category, color) 
              VALUES (
                'Welcome to your Notes Manager! 🚀', 
                'This is your first note. You can click on it to read the details, edit it, or delete it.\\n\\n### Features:\\n- Markdown rendering is supported!\\n- Search notes using the search bar.\\n- Filter by selecting category tags.\\n- Give each note a custom color for easy tracking.',
                'Personal',
                '#8b5cf6'
              )
            `, (err2) => {
              if (err2) reject(err2);
              else resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  });
};

// Simple helpers to run SQL queries using clean async/await
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export default db;