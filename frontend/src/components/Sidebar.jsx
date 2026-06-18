import React from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategorySelect,
}) {
  const categories = ['All', 'Personal', 'Work', 'Ideas', 'Study'];

  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      activeCategory === 'All' || note.category === activeCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <span className="brand-name">Notes Aura</span>
        </div>

        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search notes..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => onCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => {
            const cardStyle = {
              '--note-accent-color': note.color || '#8b5cf6',
              '--note-accent-color-glow': `${note.color || '#8b5cf6'}22`,
            };

            return (
              <div
                key={note.id}
                className={`note-card ${activeNoteId === note.id ? 'active' : ''}`}
                style={cardStyle}
                onClick={() => onSelectNote(note.id)}
              >
                <div className="note-card-header">
                  <h3 className="note-card-title">{note.title}</h3>
                </div>
                <p className="note-card-body">
                  {note.content ? note.content.replace(/[#*`_-]/g, '') : 'No content'}
                </p>
                <div className="note-card-footer">
                  <span className="note-card-date">{formatDate(note.updated_at)}</span>
                  <span className="note-card-category">{note.category}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-list-text">No notes found.</div>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="btn-new-note" onClick={onCreateNote}>
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>
    </div>
  );
}