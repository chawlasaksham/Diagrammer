// src/pages/node-configuration-panel/components/NodeHeader.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const NodeHeader = ({ nodeType, nodeName, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-secondary-50">
      <div className="flex items-center space-x-4">
        {/* Node Icon */}
        <div 
          className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            ${nodeType?.color || 'bg-primary'} text-white
          `}
        >
          <Icon name={nodeType?.icon || 'Settings'} size={24} />
        </div>
        
        {/* Node Info */}
        <div>
          <h2 className="text-xl font-heading-semibold text-text-primary">
            {nodeName}
          </h2>
          <p className="text-sm text-text-secondary">
            {nodeType?.description || 'Configure node settings'}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-2">
        {/* Help Button */}
        <button
          className="p-2 text-text-tertiary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors"
          title="Help"
        >
          <Icon name="HelpCircle" size={20} />
        </button>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 text-text-tertiary hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors"
          title="Close"
        >
          <Icon name="X" size={20} />
        </button>
      </div>
    </div>
  );
};

export default NodeHeader;