import React, { useState, useMemo } from 'react';
import Icon from 'components/AppIcon';

const NodePalette = ({ onNodeAdd, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const nodeTypes = [
    // Basic shapes
    { id: 'rectangle', name: 'Rectangle', category: 'basic', type: 'rectangle', description: 'Rectangle shape', icon: 'Rectangle', defaultData: { text: 'Rectangle', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'circle', name: 'Circle', category: 'basic', type: 'circle', description: 'Circle shape', icon: 'Circle', defaultData: { text: 'Circle', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'ellipse', name: 'Ellipse', category: 'basic', type: 'ellipse', description: 'Ellipse shape', icon: 'Ellipse', defaultData: { text: 'Ellipse', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'diamond', name: 'Diamond', category: 'basic', type: 'diamond', description: 'Diamond shape', icon: 'Diamond', defaultData: { text: 'Diamond', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'parallelogram', name: 'Parallelogram', category: 'basic', type: 'parallelogram', description: 'Parallelogram shape', icon: 'Parallelogram', defaultData: { text: 'Parallelogram', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'trapezoid', name: 'Trapezoid', category: 'basic', type: 'trapezoid', description: 'Trapezoid shape', icon: 'Trapezoid', defaultData: { text: 'Trapezoid', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'pentagon', name: 'Pentagon', category: 'basic', type: 'pentagon', description: 'Pentagon shape', icon: 'Pentagon', defaultData: { text: 'Pentagon', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'hexagon', name: 'Hexagon', category: 'basic', type: 'hexagon', description: 'Hexagon shape', icon: 'Hexagon', defaultData: { text: 'Hexagon', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'octagon', name: 'Octagon', category: 'basic', type: 'octagon', description: 'Octagon shape', icon: 'Octagon', defaultData: { text: 'Octagon', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'star', name: 'Star', category: 'basic', type: 'star', description: 'Star shape', icon: 'Star', defaultData: { text: 'Star', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'cross', name: 'Cross', category: 'basic', type: 'cross', description: 'Cross shape', icon: 'Cross', defaultData: { text: 'Cross', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'arrow', name: 'Arrow', category: 'basic', type: 'arrow', description: 'Arrow shape', icon: 'Arrow', defaultData: { text: 'Arrow', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'house', name: 'House', category: 'basic', type: 'house', description: 'House shape', icon: 'House', defaultData: { text: 'House', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'lshape1', name: 'L-Shape 1', category: 'basic', type: 'lshape1', description: 'L-Shape 1', icon: 'LShape1', defaultData: { text: 'L', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'lshape2', name: 'L-Shape 2', category: 'basic', type: 'lshape2', description: 'L-Shape 2', icon: 'LShape2', defaultData: { text: 'L', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    // Advanced shapes
    { id: 'image', name: 'Image', category: 'advanced', type: 'image', description: 'Image shape', icon: 'Image', defaultData: { text: 'Image', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'header', name: 'Header', category: 'advanced', type: 'header', description: 'Header shape', icon: 'Header', defaultData: { text: 'Header', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'database', name: 'Database', category: 'advanced', type: 'database', description: 'Database shape', icon: 'Database', defaultData: { text: 'Database', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'cylinder', name: 'Cylinder', category: 'advanced', type: 'cylinder', description: 'Cylinder shape', icon: 'Cylinder', defaultData: { text: 'Cylinder', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] },
    { id: 'document', name: 'Document', category: 'advanced', type: 'document', description: 'Document shape', icon: 'Document', defaultData: { text: 'Document', isConditional: true, condition: 'inactive' }, inputs: [], outputs: [] }
  ];

  const categories = [
    { id: 'all', name: 'All Nodes', icon: 'Grid3X3', count: nodeTypes.length }
  ];

  const filteredNodes = useMemo(() => {
    return nodeTypes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/json', JSON.stringify(nodeType));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleNodeClick = (nodeType) => {
    // Add node at center of canvas
    onNodeAdd(nodeType, { x: 300, y: 200 });
  };

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-heading-medium text-text-primary">Node Palette</h3>
        <button
          onClick={onClose}
          className="p-1 text-text-tertiary hover:text-text-primary transition-micro rounded"
        >
          <Icon name="X" size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" 
          />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-secondary-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-border">
        <div className="space-y-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-micro
                ${selectedCategory === category.id
                  ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <Icon name={category.icon} size={16} />
                <span className="font-body-medium">{category.name}</span>
              </div>
              <span className="text-xs opacity-60">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Basic shapes */}
      <div className="p-2">
        <div className="text-xs font-bold text-gray-500 mb-2">Basic shapes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 36px)', gap: '12px' }}>
          {nodeTypes.filter(n => n.category === 'basic').map(nodeType => (
            <div
              key={nodeType.id}
              draggable
              onDragStart={e => handleDragStart(e, nodeType)}
              onClick={() => handleNodeClick(nodeType)}
              style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: 'pointer' }}
            >
              {/* Render SVG icon for each shape */}
              {nodeType.icon === 'Rectangle' && (
                <svg width="28" height="28"><rect x="3" y="8" width="22" height="12" stroke="#222" fill="none" strokeWidth="2" rx="2" /></svg>
              )}
              {nodeType.icon === 'Circle' && (
                <svg width="28" height="28"><circle cx="14" cy="14" r="10" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Ellipse' && (
                <svg width="28" height="28"><ellipse cx="14" cy="14" rx="10" ry="7" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Diamond' && (
                <svg width="28" height="28"><polygon points="14,3 25,14 14,25 3,14" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Parallelogram' && (
                <svg width="28" height="28"><polygon points="7,6 25,6 21,22 3,22" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Trapezoid' && (
                <svg width="28" height="28"><polygon points="7,6 21,6 25,22 3,22" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Pentagon' && (
                <svg width="28" height="28"><polygon points="14,3 25,11 21,25 7,25 3,11" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Hexagon' && (
                <svg width="28" height="28"><polygon points="7,3 21,3 25,14 21,25 7,25 3,14" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Octagon' && (
                <svg width="28" height="28"><polygon points="9,3 19,3 25,9 25,19 19,25 9,25 3,19 3,9" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Star' && (
                <svg width="28" height="28"><polygon points="14,3 16,11 25,11 17,16 19,25 14,19 9,25 11,16 3,11 12,11" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Cross' && (
                <svg width="28" height="28"><rect x="12" y="3" width="4" height="22" stroke="#222" fill="none" strokeWidth="2" /><rect x="3" y="12" width="22" height="4" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'Arrow' && (
                <svg width="28" height="28"><polygon points="3,14 20,14 20,8 25,14 20,20 20,14" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'House' && (
                <svg width="28" height="28"><polygon points="14,3 25,14 25,25 3,25 3,14" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'LShape1' && (
                <svg width="28" height="28"><polygon points="3,3 15,3 15,15 25,15 25,25 3,25" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
              {nodeType.icon === 'LShape2' && (
                <svg width="28" height="28"><polygon points="25,3 25,25 3,25 3,15 15,15 15,3" stroke="#222" fill="none" strokeWidth="2" /></svg>
              )}
                </div>
          ))}
                    </div>
                  </div>
      {/* Advanced shapes */}
      <div className="p-2">
        <div className="text-xs font-bold text-gray-500 mb-2">Advanced shapes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 36px)', gap: '12px' }}>
          {nodeTypes.filter(n => n.category === 'advanced').map(nodeType => (
            <div
              key={nodeType.id}
              style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d1d5db', borderRadius: 4, background: '#fff', cursor: 'not-allowed', opacity: 0.6 }}
              title="Not available yet"
            >
              {nodeType.icon === 'Image' && (
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <rect x="3" y="5" width="22" height="16" rx="2" stroke="#222" fill="none" strokeWidth="2"/>
                  <circle cx="9" cy="11" r="2" fill="#222" />
                  <polyline points="5,19 12,13 17,17 23,11" stroke="#222" fill="none" strokeWidth="2"/>
                </svg>
              )}
              {nodeType.icon === 'Database' && (
                <Icon name="Database" size={24} />
              )}
              {nodeType.icon === 'Header' && (
                <svg width="28" height="28">
                  <rect x="3" y="8" width="22" height="12" stroke="#222" fill="none" strokeWidth="2" rx="2" />
                  <rect x="3" y="8" width="22" height="6" fill="#222" />
                  <text x="14" y="13" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="bold">header</text>
                </svg>
              )}
              {nodeType.icon === 'Document' && (
                <svg width="28" height="28">
                  <rect x="6" y="6" width="16" height="16" stroke="#222" fill="none" strokeWidth="2" rx="2" />
                  <polyline points="18,6 22,6 22,10" stroke="#222" fill="none" strokeWidth="2" />
                </svg>
              )}
              {nodeType.icon === 'Cylinder' && (
                <svg width="28" height="28">
                  <ellipse cx="14" cy="8" rx="10" ry="4" stroke="#222" fill="none" strokeWidth="2" />
                  <rect x="4" y="8" width="20" height="12" stroke="#222" fill="none" strokeWidth="2" />
                  <ellipse cx="14" cy="20" rx="10" ry="4" stroke="#222" fill="none" strokeWidth="2" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="p-4 border-t border-border bg-secondary-50">
        <p className="text-xs text-text-tertiary">
          <Icon name="Info" size={12} className="inline mr-1" />
          Drag nodes to canvas or click to add at center
        </p>
      </div>
    </div>
  );
};

export default NodePalette;