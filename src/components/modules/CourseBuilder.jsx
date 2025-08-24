import { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import OutlineView from './OutlineView';

import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleItem from './ModuleItem';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';

// Data structure for better scalability
const initialData = {
  modules: [],
  resources: [], // Resources can exist outside modules
  moduleOrder: [], // Track module order for drag & drop
  resourceOrder: {}, // Track resource order within each module
};

const CourseBuilder = () => {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedModuleId, setHighlightedModuleId] = useState(null);
  const [isOutlineVisible, setIsOutlineVisible] = useState(true);

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Current items for editing
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentResource, setCurrentResource] = useState(null);

  // Refs for scroll handling
  const moduleRefs = useRef({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('courseBuilderData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('courseBuilderData', JSON.stringify(data));
  }, [data]);

  // Filter data based on search query
  const filteredData = {
    modules: data.modules.filter(
      module =>
        searchQuery === '' ||
        module.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    resources: data.resources.filter(
      resource =>
        searchQuery === '' ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.type === 'link' &&
          resource.url.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  };

  // Get resources for a specific module
  const getModuleResources = moduleId => {
    return data.resources.filter(resource => resource.moduleId === moduleId);
  };

  // Get standalone resources (not in any module)
  const getStandaloneResources = () => {
    return data.resources.filter(resource => !resource.moduleId);
  };

  const handleAddClick = type => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        setCurrentResource(null);
        setCurrentModuleId(null);
        setIsLinkModalOpen(true);
        break;
      case 'upload':
        setCurrentResource(null);
        setCurrentModuleId(null);
        setIsUploadModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
    setCurrentResource(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
    setCurrentResource(null);
  };

  const handleSaveModule = module => {
    if (currentModule) {
      // Edit existing module
      setData(prev => ({
        ...prev,
        modules: prev.modules.map(m => (m.id === module.id ? module : m)),
      }));
    } else {
      // Add new module
      const newModule = {
        ...module,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setData(prev => ({
        ...prev,
        modules: [...prev.modules, newModule],
        moduleOrder: [...prev.moduleOrder, newModule.id],
        resourceOrder: { ...prev.resourceOrder, [newModule.id]: [] },
      }));
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId),
      moduleOrder: prev.moduleOrder.filter(id => id !== moduleId),
      resources: prev.resources.filter(
        resource => resource.moduleId !== moduleId
      ),
      resourceOrder: { ...prev.resourceOrder, [moduleId]: undefined },
    }));
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveLink = linkItem => {
    if (currentResource) {
      // Edit existing resource
      setData(prev => ({
        ...prev,
        resources: prev.resources.map(r =>
          r.id === linkItem.id ? linkItem : r
        ),
      }));
    } else {
      // Add new resource
      const newResource = {
        ...linkItem,
        id: Date.now().toString(),
        moduleId: currentModuleId,
        createdAt: new Date().toISOString(),
      };
      setData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource],
        resourceOrder: {
          ...prev.resourceOrder,
          [currentModuleId]: [
            ...(prev.resourceOrder[currentModuleId] || []),
            newResource.id,
          ],
        },
      }));
    }
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
    setCurrentResource(null);
  };

  const handleSaveUpload = fileItem => {
    if (currentResource) {
      // Edit existing resource
      setData(prev => ({
        ...prev,
        resources: prev.resources.map(r =>
          r.id === fileItem.id ? fileItem : r
        ),
      }));
    } else {
      // Add new resource
      const newResource = {
        ...fileItem,
        id: Date.now().toString(),
        moduleId: currentModuleId,
        createdAt: new Date().toISOString(),
      };
      setData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource],
        resourceOrder: {
          ...prev.resourceOrder,
          [currentModuleId]: [
            ...(prev.resourceOrder[currentModuleId] || []),
            newResource.id,
          ],
        },
      }));
    }
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
    setCurrentResource(null);
  };

  const handleDeleteItem = itemId => {
    setData(prev => {
      const resource = prev.resources.find(r => r.id === itemId);
      if (resource && resource.moduleId) {
        // Remove from module's resource order
        const updatedResourceOrder = { ...prev.resourceOrder };
        if (updatedResourceOrder[resource.moduleId]) {
          updatedResourceOrder[resource.moduleId] = updatedResourceOrder[
            resource.moduleId
          ].filter(id => id !== itemId);
        }
        return {
          ...prev,
          resources: prev.resources.filter(r => r.id !== itemId),
          resourceOrder: updatedResourceOrder,
        };
      }
      return {
        ...prev,
        resources: prev.resources.filter(r => r.id !== itemId),
      };
    });
  };

  const handleEditResource = resource => {
    setCurrentResource(resource);
    setCurrentModuleId(resource.moduleId);
    if (resource.type === 'link') {
      setIsLinkModalOpen(true);
    } else if (resource.type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  // Drag and Drop handlers
  const handleModuleReorder = (dragIndex, hoverIndex) => {
    setData(prev => {
      const newModuleOrder = [...prev.moduleOrder];
      const draggedId = newModuleOrder[dragIndex];
      newModuleOrder.splice(dragIndex, 1);
      newModuleOrder.splice(hoverIndex, 0, draggedId);
      return { ...prev, moduleOrder: newModuleOrder };
    });
  };

  const handleResourceReorder = (moduleId, dragIndex, hoverIndex) => {
    setData(prev => {
      const newResourceOrder = { ...prev.resourceOrder };
      const moduleResources = [...(newResourceOrder[moduleId] || [])];
      const draggedId = moduleResources[dragIndex];
      moduleResources.splice(dragIndex, 1);
      moduleResources.splice(hoverIndex, 0, draggedId);
      newResourceOrder[moduleId] = moduleResources;
      return { ...prev, resourceOrder: newResourceOrder };
    });
  };

  const handleResourceMove = (resourceId, fromModuleId, toModuleId) => {
    setData(prev => {
      // Remove from source module's resource order
      const updatedResourceOrder = { ...prev.resourceOrder };
      if (fromModuleId && updatedResourceOrder[fromModuleId]) {
        updatedResourceOrder[fromModuleId] = updatedResourceOrder[
          fromModuleId
        ].filter(id => id !== resourceId);
      }

      // Add to target module's resource order
      if (toModuleId) {
        updatedResourceOrder[toModuleId] = [
          ...(updatedResourceOrder[toModuleId] || []),
          resourceId,
        ];
      }

      // Update resource's moduleId
      const updatedResources = prev.resources.map(r =>
        r.id === resourceId ? { ...r, moduleId: toModuleId } : r
      );

      return {
        ...prev,
        resources: updatedResources,
        resourceOrder: updatedResourceOrder,
      };
    });
  };

  // Scroll to module handler
  const handleModuleClick = moduleId => {
    const moduleElement = moduleRefs.current[moduleId];
    if (moduleElement) {
      moduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightedModuleId(moduleId);
      setTimeout(() => setHighlightedModuleId(null), 2000);
    }
  };

  // Get ordered modules and resources
  const orderedModules = data.moduleOrder
    .map(id => data.modules.find(m => m.id === id))
    .filter(Boolean);

  const getOrderedResources = moduleId => {
    const order = data.resourceOrder[moduleId] || [];
    return order
      .map(id => data.resources.find(r => r.id === id))
      .filter(Boolean);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="course-builder">
        <Header
          onAddClick={handleAddClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isOutlineVisible={isOutlineVisible}
          onToggleOutline={() => setIsOutlineVisible(!isOutlineVisible)}
        />

        <div className="builder-content">
          <div className="main-content">
            {orderedModules.length === 0 &&
            getStandaloneResources().length === 0 ? (
              <EmptyState onAddClick={handleAddClick} />
            ) : (
              <div className="module-list">
                {orderedModules.map((module, index) => (
                  <div
                    key={module.id}
                    ref={el => (moduleRefs.current[module.id] = el)}
                  >
                    <ModuleCard
                      module={module}
                      resources={getOrderedResources(module.id)}
                      onEdit={handleEditModule}
                      onDelete={handleDeleteModule}
                      onAddItem={handleAddItem}
                      onDeleteItem={handleDeleteItem}
                      onEditResource={handleEditResource}
                      onReorder={handleResourceReorder}
                      onMove={handleResourceMove}
                      dragIndex={index}
                      onModuleReorder={handleModuleReorder}
                      isHighlighted={highlightedModuleId === module.id}
                    />
                  </div>
                ))}

                {/* Standalone resources section */}
                {getStandaloneResources().length > 0 && (
                  <div className="standalone-resources">
                    <h3 className="standalone-title">Other Resources</h3>
                    <div className="standalone-list">
                      {getStandaloneResources().map((resource, index) => (
                        <ModuleItem
                          key={resource.id}
                          item={resource}
                          onDelete={handleDeleteItem}
                          onEdit={() => handleEditResource(resource)}
                          onMove={handleResourceMove}
                          isStandalone={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Drop zone for creating standalone resources */}
                <div className="standalone-drop-zone">
                  <div className="drop-zone-content">
                    <p className="drop-zone-text">
                      Drop resources here to make them standalone
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Outline View */}
          {isOutlineVisible && (
            <OutlineView
              modules={orderedModules}
              resources={data.resources}
              onModuleClick={handleModuleClick}
              highlightedModuleId={highlightedModuleId}
            />
          )}
        </div>

        {/* Module Modal */}
        <ModuleModal
          isOpen={isModuleModalOpen}
          onClose={handleCloseModuleModal}
          onSave={handleSaveModule}
          module={currentModule}
        />

        {/* Link Modal */}
        <LinkModal
          isOpen={isLinkModalOpen}
          onClose={handleCloseLinkModal}
          onSave={handleSaveLink}
          moduleId={currentModuleId}
          resource={currentResource}
        />

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={handleCloseUploadModal}
          onSave={handleSaveUpload}
          moduleId={currentModuleId}
          resource={currentResource}
        />
      </div>
    </DndProvider>
  );
};

export default CourseBuilder;
