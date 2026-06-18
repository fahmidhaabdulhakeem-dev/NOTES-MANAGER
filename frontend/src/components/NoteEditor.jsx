import React, { useState, useEffect } from 'react';

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [color, setColor] = useState('#8b5cf6');

  const categories = ['Personal', 'Work', 'Ideas', 'Study'];
  const colorOptions = [
    { value: '#8b5cf6', label: 'Violet' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#14b8a6', label: 'Teal' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#f43f5e', label: 'Rose' },
  ];

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setCategory(note.category || 'Personal');
      setColor(note.color || '#8b5cf6');
    } else {
      setTitle('');
      setContent('');
      setCategory('Personal');
      setColor('#8b5cf6');
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ id: note ? note.id : undefined, title, content, category, color });
  };

  return (
    <div className="note-editor-container" style={{ '--note-accent-color': color }}>
      <form onSubmit={handleSubmit} className="editor-form">
        <input
          type="text"
          placeholder="Note Title"
          className="editor-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="editor-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="editor-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Theme Color</label>
            <div className="color-picker">
              {colorOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`color-option ${color === opt.value ? 'selected' : ''}`}
                  style={{ backgroundColor: opt.value }}
                  onClick={() => setColor(opt.value)}
                  title={opt.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="form-group editor-textarea-wrapper">
          <label className="form-label">Content</label>
          <textarea
            placeholder="Start writing... (Use # for titles, - for list bullets)"
            className="editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="editor-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Note</button>
        </div>
      </form>
    </div>
  );
}