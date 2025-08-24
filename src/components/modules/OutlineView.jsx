import { useState, useEffect } from 'react';

const OutlineView = ({
  modules,
  resources,
  onModuleClick,
  highlightedModuleId,
}) => {
  const [visibleModules, setVisibleModules] = useState(new Set());

  // Track which modules are visible in the viewport
  useEffect(() => {
    const handleScroll = () => {
      const moduleElements = document.querySelectorAll('[data-module-id]');
      const newVisibleModules = new Set();

      moduleElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const moduleId = element.dataset.moduleId;
          newVisibleModules.add(moduleId);
        }
      });

      setVisibleModules(newVisibleModules);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [modules]);

  // Group resources by module
  const resourcesByModule = resources.reduce((acc, resource) => {
    if (resource.moduleId) {
      if (!acc[resource.moduleId]) {
        acc[resource.moduleId] = [];
      }
      acc[resource.moduleId].push(resource);
    }
    return acc;
  }, {});

  // Get standalone resources
  const standaloneResources = resources.filter(resource => !resource.moduleId);

  return (
    <div className="outline-view">
      <div className="outline-header">
        <h3 className="outline-title">Course Outline</h3>
        <span className="outline-count">
          {modules.length} module{modules.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="outline-content">
        {modules.length === 0 ? (
          <div className="outline-empty">
            <p>No modules created yet</p>
          </div>
        ) : (
          <div className="outline-modules">
            {modules.map((module, index) => {
              const moduleResources = resourcesByModule[module.id] || [];
              const isVisible = visibleModules.has(module.id);
              const isHighlighted = highlightedModuleId === module.id;

              return (
                <div
                  key={module.id}
                  className={`outline-module ${isVisible ? 'visible' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                >
                  <div
                    className="outline-module-header"
                    onClick={() => onModuleClick(module.id)}
                  >
                    <span className="outline-module-number">{index + 1}</span>
                    <span className="outline-module-name">{module.name}</span>
                    <span className="outline-module-count">
                      {moduleResources.length} item
                      {moduleResources.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {moduleResources.length > 0 && (
                    <div className="outline-resources">
                      {moduleResources.map((resource, resourceIndex) => (
                        <div key={resource.id} className="outline-resource">
                          <span className="outline-resource-icon">
                            {resource.type === 'link' ? '🔗' : '📄'}
                          </span>
                          <span className="outline-resource-title">
                            {resource.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Standalone resources section */}
        {standaloneResources.length > 0 && (
          <div className="outline-standalone">
            <h4 className="outline-standalone-title">Other Resources</h4>
            <div className="outline-standalone-resources">
              {standaloneResources.map(resource => (
                <div key={resource.id} className="outline-resource standalone">
                  <span className="outline-resource-icon">
                    {resource.type === 'link' ? '🔗' : '📄'}
                  </span>
                  <span className="outline-resource-title">
                    {resource.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutlineView;
