import { useDrag, useDrop } from 'react-dnd';

const ModuleItem = ({
  item,
  onDelete,
  onEdit,
  onReorder,
  onMove,
  moduleId,
  dragIndex,
  isStandalone = false,
}) => {
  // Drag and drop for resources
  const [{ isDragging }, dragRef] = useDrag({
    type: 'RESOURCE',
    item: {
      id: item.id,
      index: dragIndex,
      moduleId: item.moduleId,
      type: item.type,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'RESOURCE',
    hover: (draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      if (draggedItem.id === item.id) return;

      // Same module reordering
      if (draggedItem.moduleId === moduleId) {
        if (draggedItem.index === dragIndex) return;
        onReorder(moduleId, draggedItem.index, dragIndex);
        draggedItem.index = dragIndex;
      } else {
        // Moving between modules - this will be handled by the module drop zone
        // We don't need to do anything here for cross-module movement
      }
    },
  });

  const handleDelete = e => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handleEdit = e => {
    e.stopPropagation();
    onEdit(item);
  };

  // Get file type display
  const getFileTypeDisplay = () => {
    if (item.type === 'link') return 'Link';
    if (item.fileType === 'application/pdf') return 'PDF';
    if (item.fileType?.includes('image/')) return 'Image';
    if (item.fileType?.includes('text/')) return 'Document';
    return 'File';
  };

  // Get appropriate icon
  const getFileIcon = () => {
    if (item.type === 'link') return '🔗';
    if (item.fileType === 'application/pdf') return '📄';
    if (item.fileType?.includes('image/')) return '🖼️';
    if (item.fileType?.includes('text/')) return '📝';
    return '📎';
  };

  // Get file type badge color
  const getFileTypeBadgeClass = () => {
    if (item.type === 'link') return 'link-badge';
    if (item.fileType === 'application/pdf') return 'pdf-badge';
    if (item.fileType?.includes('image/')) return 'image-badge';
    return 'file-badge';
  };

  // Render different UI based on item type
  if (item.type === 'link') {
    return (
      <div
        className={`module-item link-item ${isDragging ? 'dragging' : ''}`}
        ref={node => {
          dragRef(node);
          dropRef(node);
        }}
      >
        <div className="item-content">
          <div className="item-icon">
            <span className="icon-link">🔗</span>
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.title}</h4>
            <a
              href={item.url}
              className="item-url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.url}
            </a>
            <span className={`file-type-badge ${getFileTypeBadgeClass()}`}>
              {getFileTypeDisplay()}
            </span>
          </div>
        </div>
        <div className="item-actions">
          <button className="item-edit" onClick={handleEdit} title="Edit">
            <span className="edit-icon">✏️</span>
          </button>
          <button className="item-delete" onClick={handleDelete} title="Delete">
            <span className="delete-icon">🗑️</span>
          </button>
        </div>
      </div>
    );
  }

  if (item.type === 'file') {
    return (
      <div
        className={`module-item file-item ${isDragging ? 'dragging' : ''}`}
        ref={node => {
          dragRef(node);
          dropRef(node);
        }}
      >
        <div className="item-content">
          <div className="item-icon">
            <span className="icon-file">{getFileIcon()}</span>
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.title}</h4>
            <p className="item-details">
              {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
            </p>
            <span className={`file-type-badge ${getFileTypeBadgeClass()}`}>
              {getFileTypeDisplay()}
            </span>
          </div>
        </div>
        <div className="item-actions">
          <button className="item-edit" onClick={handleEdit} title="Edit">
            <span className="edit-icon">✏️</span>
          </button>
          <button className="item-delete" onClick={handleDelete} title="Delete">
            <span className="delete-icon">🗑️</span>
          </button>
        </div>
      </div>
    );
  }

  return null; // Fallback for unknown item types
};

export default ModuleItem;
