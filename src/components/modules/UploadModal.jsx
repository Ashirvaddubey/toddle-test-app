import { useState, useEffect } from 'react';

const UploadModal = ({
  isOpen,
  onClose,
  onSave,
  moduleId,
  resource = null,
}) => {
  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Reset form when modal opens/closes or resource changes
  useEffect(() => {
    if (isOpen) {
      if (resource) {
        // Editing existing resource
        setFileTitle(resource.title || '');
        setSelectedFile(null); // Don't pre-fill file for editing
        setFilePreview(null);
      } else {
        // Adding new resource
        setFileTitle('');
        setSelectedFile(null);
        setFilePreview(null);
      }
    }
  }, [isOpen, resource]);

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview for PDFs
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = e => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (resource && !selectedFile) {
      // Editing existing resource - keep existing file info
      onSave({
        id: resource.id,
        moduleId: moduleId || resource.moduleId,
        type: 'file',
        title: fileTitle.trim(),
        fileName: resource.fileName,
        fileSize: resource.fileSize,
        fileType: resource.fileType,
        filePreview: resource.filePreview,
      });
    } else if (selectedFile) {
      // New resource or resource with new file
      onSave({
        id: resource ? resource.id : Date.now().toString(),
        moduleId: moduleId || resource?.moduleId,
        type: 'file',
        title: fileTitle.trim(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        filePreview: filePreview,
      });
    }

    // Reset form
    setFileTitle('');
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleClose = () => {
    setFileTitle('');
    setSelectedFile(null);
    setFilePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!resource;
  const isValid = fileTitle.trim() && (selectedFile || (isEditing && resource));
  const isPDF =
    selectedFile?.type === 'application/pdf' ||
    resource?.fileType === 'application/pdf';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit file' : 'Upload file'}</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="file-title">File title</label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                placeholder="File title"
                className="form-input"
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="file-upload">
                {isEditing ? 'Select new file (optional)' : 'Select file'}
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              {selectedFile && (
                <div className="selected-file">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                  {isPDF && <span className="file-type-badge pdf">PDF</span>}
                </div>
              )}
              {isEditing && resource && !selectedFile && (
                <div className="current-file">
                  <span className="current-file-label">Current file:</span>
                  <span className="file-name">{resource.fileName}</span>
                  <span className="file-size">
                    ({Math.round(resource.fileSize / 1024)} KB)
                  </span>
                  {resource.fileType === 'application/pdf' && (
                    <span className="file-type-badge pdf">PDF</span>
                  )}
                </div>
              )}
            </div>

            {/* PDF Preview */}
            {filePreview && isPDF && (
              <div className="pdf-preview">
                <label>PDF Preview:</label>
                <div className="pdf-preview-container">
                  <iframe
                    src={filePreview}
                    title="PDF Preview"
                    width="100%"
                    height="300"
                    className="pdf-iframe"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={!isValid}>
              {isEditing ? 'Save changes' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
