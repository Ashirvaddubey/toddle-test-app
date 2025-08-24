import React from 'react';

const EmptyState = ({ onAddClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        <img
          src="/##.svg"
          alt="Empty illustration"
          className="empty-state-image"
        />
      </div>
      <h2 className="empty-state-title">Nothing added here yet</h2>
      <p className="empty-state-description">
        Start building your course by creating modules and adding resources
      </p>
      <div className="empty-state-actions">
        <button
          className="btn-create-module"
          onClick={() => onAddClick('module')}
        >
          <span className="add-icon">+</span>
          Create your first module
        </button>
        <div className="empty-state-options">
          <button className="btn-add-link" onClick={() => onAddClick('link')}>
            <span className="item-icon">🔗</span>
            Add a link
          </button>
          <button className="btn-upload" onClick={() => onAddClick('upload')}>
            <span className="item-icon">⬆️</span>
            Upload file
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
