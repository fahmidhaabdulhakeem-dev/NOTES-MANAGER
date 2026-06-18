import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function NoteViewer({ note, onEdit, onDelete }) {
  if (!note) return null;

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderMarkdown = (text) => {
    if (!text) return <p>No content</p>;
    const lines = text.split('\n');
    const elements = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        elements.push(<h1 key={index}>{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index}>{line.substring(3)}</h2>);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(<li key={index}>{line.substring(2)}</li>);
      } else {
        elements.push(<p key={index}>{line}</p>);
      }
    });
    return elements;
  };

  const viewerStyle = {
    '--note-accent-color': note.color || '#8b5cf6',
    '--note-accent-color-glow': `${note.color || '#8b5cf6'}22`,
  };

  return (
    <div className="note-viewer-container" style={viewerStyle}>
      <div className="viewer-header">
        <div className="viewer-meta">
          <span className="viewer-category">{note.category}</span>
          <span className="viewer-date">Last updated: {formatDate(note.updated_at)}</span>
        </div>
        <div className="viewer-actions">
          <button className="btn-icon" onClick={onEdit} title="Edit Note">
            <Edit2 size={16} />
          </button>
          <button className="btn-icon btn-delete" onClick={() => onDelete(note.id)} title="Delete Note">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="viewer-body">
        <h1 className="viewer-title">{note.title}</h1>
        <div className="viewer-content">{renderMarkdown(note.content)}</div>
      </div>
    </div>
  );
}