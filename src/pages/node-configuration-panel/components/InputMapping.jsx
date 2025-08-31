// src/pages/node-configuration-panel/components/InputMapping.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import FormField from './common/FormField';
import FormSelect from './common/FormSelect';

const InputMapping = ({ nodeType, configuration, onChange, errors }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  // Mock available fields from previous nodes
  const availableFields = [
    { id: 'user.id', label: 'User ID', type: 'string', source: 'User Data Node' },
    { id: 'user.email', label: 'User Email', type: 'string', source: 'User Data Node' },
    { id: 'user.name', label: 'User Name', type: 'string', source: 'User Data Node' },
    { id: 'order.id', label: 'Order ID', type: 'string', source: 'Order Processing Node' },
    { id: 'order.total', label: 'Order Total', type: 'number', source: 'Order Processing Node' },
    { id: 'order.items', label: 'Order Items', type: 'array', source: 'Order Processing Node' },
    { id: 'timestamp', label: 'Timestamp', type: 'datetime', source: 'System' },
    { id: 'api.response', label: 'API Response', type: 'object', source: 'API Call Node' }
  ];

  // Mock required input fields for current node
  const getRequiredFields = () => {
    switch (nodeType) {
      case 'api-call':
        return [
          { id: 'url', label: 'URL', type: 'string', required: true },
          { id: 'body', label: 'Request Body', type: 'object', required: false },
          { id: 'headers', label: 'Headers', type: 'object', required: false },
          { id: 'params', label: 'Query Parameters', type: 'object', required: false }
        ];
      case 'data-transform':
        return [
          { id: 'inputData', label: 'Input Data', type: 'any', required: true },
          { id: 'transformRules', label: 'Transform Rules', type: 'object', required: false }
        ];
      case 'database':
        return [
          { id: 'query', label: 'SQL Query', type: 'string', required: true },
          { id: 'parameters', label: 'Query Parameters', type: 'object', required: false }
        ];
      case 'webhook':
        return [
          { id: 'payload', label: 'Webhook Payload', type: 'object', required: true },
          { id: 'headers', label: 'Custom Headers', type: 'object', required: false }
        ];
      default:
        return [
          { id: 'input', label: 'Input Data', type: 'any', required: true }
        ];
    }
  };

  const requiredFields = getRequiredFields();
  const mappings = configuration.fieldMappings || {};

  const handleMappingChange = (fieldId, mapping) => {
    const newMappings = { ...mappings, [fieldId]: mapping };
    onChange('fieldMappings', newMappings);
  };

  const handleDragStart = (e, field) => {
    setDraggedItem(field);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e, targetFieldId) => {
    e.preventDefault();
    if (draggedItem) {
      handleMappingChange(targetFieldId, {
        source: draggedItem.id,
        sourceLabel: draggedItem.label,
        transform: ''
      });
      setDraggedItem(null);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'string': return 'Type';
      case 'number': return 'Hash';
      case 'boolean': return 'ToggleLeft';
      case 'array': return 'List';
      case 'object': return 'Package';
      case 'datetime': return 'Calendar';
      default: return 'HelpCircle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'string': return 'text-blue-600';
      case 'number': return 'text-green-600';
      case 'boolean': return 'text-purple-600';
      case 'array': return 'text-orange-600';
      case 'object': return 'text-red-600';
      case 'datetime': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading-semibold text-text-primary mb-1">
          Input Mapping
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Map data from previous nodes to this node's input fields
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Fields */}
        <div className="space-y-4">
          <h4 className="font-heading-medium text-text-primary flex items-center space-x-2">
            <Icon name="Database" size={18} />
            <span>Available Fields</span>
          </h4>
          
          <div className="bg-secondary-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {availableFields.map((field) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, field)}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border hover:border-primary cursor-grab active:cursor-grabbing transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getTypeIcon(field.type)} 
                      size={16} 
                      className={getTypeColor(field.type)}
                    />
                    <div>
                      <div className="font-body-medium text-text-primary">
                        {field.label}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        {field.source}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-md bg-secondary-100 ${getTypeColor(field.type)}`}>
                      {field.type}
                    </span>
                    <Icon name="GripVertical" size={14} className="text-text-tertiary group-hover:text-text-secondary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Required Fields */}
        <div className="space-y-4">
          <h4 className="font-heading-medium text-text-primary flex items-center space-x-2">
            <Icon name="Target" size={18} />
            <span>Input Fields</span>
          </h4>
          
          <div className="space-y-3">
            {requiredFields.map((field) => {
              const mapping = mappings[field.id];
              const hasMapping = !!mapping?.source;
              
              return (
                <div
                  key={field.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, field.id)}
                  className={`
                    p-4 border-2 border-dashed rounded-lg transition-colors
                    ${
                      hasMapping 
                        ? 'border-success bg-success-50' 
                        : field.required 
                          ? 'border-error bg-error-50' :'border-border bg-surface'
                    }
                    hover:border-primary
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getTypeIcon(field.type)} 
                        size={16} 
                        className={getTypeColor(field.type)}
                      />
                      <div>
                        <div className="font-body-medium text-text-primary">
                          {field.label}
                          {field.required && <span className="text-error ml-1">*</span>}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          Type: {field.type}
                        </div>
                      </div>
                    </div>
                    
                    {hasMapping && (
                      <button
                        onClick={() => handleMappingChange(field.id, null)}
                        className="p-1 text-text-tertiary hover:text-error transition-colors"
                        title="Remove mapping"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    )}
                  </div>
                  
                  {hasMapping ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 bg-surface rounded-lg border border-success">
                        <Icon name="ArrowRight" size={16} className="text-success" />
                        <span className="text-sm font-body-medium text-text-primary">
                          Mapped from: {mapping.sourceLabel}
                        </span>
                      </div>
                      
                      <FormField
                        label="Transform (optional)"
                        value={mapping.transform || ''}
                        onChange={(value) => handleMappingChange(field.id, { ...mapping, transform: value })}
                        placeholder="e.g., value.toUpperCase() or value * 2"
                        size="sm"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Icon name="Download" size={24} className="text-text-tertiary mx-auto mb-2" />
                      <p className="text-sm text-text-tertiary">
                        Drag a field here or use manual mapping below
                      </p>
                    </div>
                  )}
                  
                  {!hasMapping && (
                    <div className="mt-3">
                      <FormSelect
                        label="Manual Mapping"
                        value=""
                        onChange={(value) => {
                          const selectedField = availableFields.find(f => f.id === value);
                          if (selectedField) {
                            handleMappingChange(field.id, {
                              source: selectedField.id,
                              sourceLabel: selectedField.label,
                              transform: ''
                            });
                          }
                        }}
                        options={[
                          { value: '', label: 'Select a field...' },
                          ...availableFields.map(f => ({ value: f.id, label: f.label }))
                        ]}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mapping Summary */}
      <div className="bg-secondary-50 rounded-lg p-4">
        <h5 className="font-heading-medium text-text-primary mb-3 flex items-center space-x-2">
          <Icon name="GitBranch" size={16} />
          <span>Mapping Summary</span>
        </h5>
        
        <div className="space-y-2">
          {requiredFields.map((field) => {
            const mapping = mappings[field.id];
            const isMapped = !!mapping?.source;
            
            return (
              <div key={field.id} className="flex items-center justify-between text-sm">
                <span className="text-text-primary">{field.label}</span>
                <span className={isMapped ? 'text-success' : 'text-error'}>
                  {isMapped ? `✓ ${mapping.sourceLabel}` : field.required ? '✗ Required' : '○ Optional'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InputMapping;