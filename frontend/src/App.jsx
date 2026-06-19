import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import Sidebar from './components/Sidebar';
import NoteViewer from './components/NoteViewer';
import NoteEditor from './components/NoteEditor';

const API_BASE_URL = 'https://notes-manager-backend.onrender.com/api';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
      if (data.length > 0 && !activeNoteId) {
        setActiveNoteId(data[0].id);
      }
    } catch (error) {
      console.error(error);
      addToast('Could not load notes from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleSelectNote = (id) => {
    setActiveNoteId(id);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setActiveNoteId(null);
  };

  const handleStartEdit = () => {
    if (!activeNote) return;
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      let response;
      let savedNote;

      if (noteData.id) {
        response = await fetch(`${API_BASE_URL}/notes/${noteData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
        if (!response.ok) throw new Error('Failed to update note');
        savedNote = await response.json();
        setNotes((prev) =>
          prev.map((n) => (n.id === savedNote.id ? savedNote : n))
        );
        addToast('Note updated successfully!');
      } else {
        response = await fetch(`${API_BASE_URL}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
        if (!response.ok) throw new Error('Failed to create note');
        savedNote = await response.json();
        setNotes((prev) => [savedNote, ...prev]);
        addToast('Note created successfully!');
      }

      setNotes((prev) => [...prev].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
      setActiveNoteId(savedNote.id);
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      console.error(error);
      addToast(error.message, 'error');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete note');
      
      const remainingNotes = notes.filter((n) => n.id !== id);
      setNotes(remainingNotes);
      addToast('Note deleted.');

      if (remainingNotes.length > 0) {
        setActiveNoteId(remainingNotes[0].id);
      } else {
        setActiveNoteId(null);
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to delete note.', 'error');
    }
  };

  return (
    <div className="app-container">
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        onCreateNote={handleStartCreate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      <div className="main-area">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : isEditing || isCreating ? (
          <NoteEditor
            note={isEditing ? activeNote : null}
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
          />
        ) : activeNote ? (
          <NoteViewer
            note={activeNote}
            onEdit={handleStartEdit}
            onDelete={handleDeleteNote}
          />
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon-wrapper">
                <BookOpen size={36} />
              </div>
              <h2 className="welcome-title">Create your first note</h2>
              <p className="welcome-subtitle">
                Keep track of your projects, daily meetings, and random ideas in style. Click "New Note" in the sidebar to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}