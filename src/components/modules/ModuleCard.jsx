import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import ModuleItem from './ModuleItem';

const ModuleCard = ({
  module,
  resources = [],
  onEdit,
  onDelete,
  onAddItem,
  onDeleteItem,
  onEditResource,
  onReorder,
  onMove,
  dragIndex,
  onModuleReorder,
  isHighlighted,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Drag and drop for modules
  const [{ isDragging: isModuleDragging }, moduleDragRef] = useDrag({
    type: 'MODULE',
    item: { index: dragIndex, id: module.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, moduleDropRef] = useDrop({
    accept: 'MODULE',
    hover: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      if (item.index === dragIndex) return;

      onModuleReorder(item.index, dragIndex);
      item.index = dragIndex;
    },
  });

  // Drop zone for resources being moved from other modules
  const [, resourceDropRef] = useDrop({
    accept: 'RESOURCE',
    hover: (draggedItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      if (draggedItem.moduleId === module.id) return; // Same module, handled by ModuleItem

      // Resource is being moved from another module to this one
      onMove(draggedItem.id, draggedItem.moduleId, module.id);
      draggedItem.moduleId = module.id;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    onEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  };

  const toggleAddMenu = e => {
    e.stopPropagation();
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleAddClick = type => {
    onAddItem(module.id, type);
    setIsAddMenuOpen(false);
  };

  return (
    <div
      className={`module-card-container ${isHighlighted ? 'highlighted' : ''}`}
      data-module-id={module.id}
    >
      <div
        className={`module-card ${isModuleDragging ? 'dragging' : ''}`}
        onClick={toggleExpanded}
        ref={node => {
          moduleDragRef(node);
          moduleDropRef(node);
        }}
      >
        <div className="module-content">
          <div className="module-icon">
            <span className={`icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          <div className="module-info">
            <h3 className="module-title">{module.name}</h3>
            <p className="module-subtitle">
              {resources.length === 0
                ? 'Add items to this module'
                : `${resources.length} item${resources.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="module-actions">
          <button className="btn-options" onClick={toggleOptions}>
            <span className="options-icon">⋮</span>
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={handleEdit}>
                <span className="option-icon">✏️</span>
                Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                <span className="option-icon">🗑️</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div
          className="module-content-expanded"
          ref={resourceDropRef} // This makes the entire expanded area a drop zone
        >
          {resources.length === 0 ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No content added to this module yet.
              </p>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="module-items">
              <div className="module-items-list">
                {resources.map((resource, index) => (
                  <ModuleItem
                    key={resource.id}
                    item={resource}
                    onDelete={onDeleteItem}
                    onEdit={() => onEditResource(resource)}
                    onReorder={onReorder}
                    onMove={onMove}
                    moduleId={module.id}
                    dragIndex={index}
                  />
                ))}
              </div>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
