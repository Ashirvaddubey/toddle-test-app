import { useState, useEffect } from 'react';

const LinkModal = ({ isOpen, onClose, onSave, moduleId, resource = null }) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Reset form when modal opens/closes or resource changes
  useEffect(() => {
    if (isOpen) {
      if (resource) {
        // Editing existing resource
        setLinkTitle(resource.title || '');
        setLinkUrl(resource.url || '');
      } else {
        // Adding new resource
        setLinkTitle('');
        setLinkUrl('');
      }
    }
  }, [isOpen, resource]);

  const handleSubmit = e => {
    e.preventDefault();

    const linkData = {
      id: resource ? resource.id : Date.now().toString(),
      moduleId: moduleId || resource?.moduleId,
      type: 'link',
      title: linkTitle.trim(),
      url: linkUrl.trim(),
    };

    onSave(linkData);

    // Reset form
    setLinkTitle('');
    setLinkUrl('');
  };

  const handleClose = () => {
    setLinkTitle('');
    setLinkUrl('');
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!resource;
  const isValid = linkTitle.trim() && linkUrl.trim();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit link' : 'Add a link'}</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="link-title">Link title</label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={e => setLinkTitle(e.target.value)}
                placeholder="Link title"
                className="form-input"
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={!isValid}>
              {isEditing ? 'Save changes' : 'Add link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
