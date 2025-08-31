import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const NodePropertiesPanel = ({ selectedNodes, onNodeUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [formData, setFormData] = useState({});

  const node = selectedNodes[0]; // For now, handle single node selection

  useEffect(() => {
    if (node) {
      setFormData(node.data || {});
    }
  }, [node]);

  const handleInputChange = (key, value) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);
    onNodeUpdate(node.id, { data: newFormData });
  };

  const handleNameChange = (newName) => {
    onNodeUpdate(node.id, { name: newName });
  };

  // Add isConditional and condition controls
  const handleConditionalChange = (e) => {
    const checked = e.target.checked;
    if (!checked) {
      onNodeUpdate(node.id, { isConditional: false, condition: false });
    } else {
      onNodeUpdate(node.id, { isConditional: true, condition: 'inactive' });
    }
  };

  const handleConditionChange = (e) => {
    onNodeUpdate(node.id, { condition: e.target.value });
  };

  const renderPropertyField = (key, value, type = 'text') => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     resize-none"
            rows={3}
            placeholder={`Enter ${key}...`}
          />
        );
      case 'select':
        const options = getSelectOptions(key);
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select {key}...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={`Enter ${key}...`}
          />
        );
      case 'checkbox':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleInputChange(key, e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <span className="text-sm text-text-secondary">Enable {key}</span>
          </label>
        );
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={`Enter ${key}...`}
          />
        );
    }
  };

  const getSelectOptions = (key) => {
    switch (key) {
      case 'method':
        return [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' },
          { value: 'PATCH', label: 'PATCH' }
        ];
      case 'interval':
        return [
          { value: '1m', label: 'Every minute' },
          { value: '5m', label: 'Every 5 minutes' },
          { value: '15m', label: 'Every 15 minutes' },
          { value: '1h', label: 'Every hour' },
          { value: '1d', label: 'Every day' }
        ];
      case 'timezone':
        return [
          { value: 'UTC', label: 'UTC' },
          { value: 'America/New_York', label: 'Eastern Time' },
          { value: 'America/Los_Angeles', label: 'Pacific Time' },
          { value: 'Europe/London', label: 'London' },
          { value: 'Asia/Tokyo', label: 'Tokyo' }
        ];
      default:
        return [];
    }
  };

  const getFieldType = (key, value) => {
    if (key === 'method' || key === 'interval' || key === 'timezone') return 'select';
    if (key === 'body' || key === 'content' || key === 'condition') return 'textarea';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'checkbox';
    return 'text';
  };

  const tabs = [
    { id: 'properties', label: 'Properties', icon: 'Settings' },
    { id: 'connections', label: 'Connections', icon: 'Link' },
    { id: 'validation', label: 'Validation', icon: 'CheckCircle2' }
  ];

  if (!node) {
    return (
      <div className="h-full flex flex-col bg-surface">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-heading-medium text-text-primary">Properties</h3>
          <button
            onClick={onClose}
            className="p-1 text-text-tertiary hover:text-text-primary transition-micro rounded"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="MousePointer" size={32} className="text-text-tertiary mx-auto mb-2" />
            <p className="text-text-tertiary">Select a node to view properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-heading-medium text-text-primary">Node Properties</h3>
        <button
          onClick={onClose}
          className="p-1 text-text-tertiary hover:text-text-primary transition-micro rounded"
        >
          <Icon name="X" size={16} />
        </button>
      </div>

      {/* Node Info */}
      <div className="p-4 border-b border-border bg-secondary-50">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center
            ${node.category === 'triggers' ? 'bg-accent-50 text-accent' :
              node.category === 'actions' ? 'bg-success-50 text-success' :
              node.category === 'logic' ? 'bg-warning-50 text-warning' : 'bg-primary-50 text-primary'}
          `}>
            <Icon name={node.icon} size={16} />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={node.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="text-sm font-body-medium text-text-primary bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
            />
            <p className="text-xs text-text-tertiary capitalize">{node.category} • {node.type}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-text-tertiary">
          <div className="flex items-center space-x-1">
            <Icon name="ArrowDown" size={12} />
            <span>{node.inputs?.length || 0} inputs</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="ArrowUp" size={12} />
            <span>{node.outputs?.length || 0} outputs</span>
          </div>
          <div className={`
            flex items-center space-x-1 px-2 py-1 rounded-full
            ${node.status === 'running' ? 'bg-success-50 text-success' :
              node.status === 'error' ? 'bg-error-50 text-error' : 'bg-secondary-100 text-text-tertiary'}
          `}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              node.status === 'running' ? 'bg-success' :
              node.status === 'error' ? 'bg-error' : 'bg-text-tertiary'
            }`} />
            <span className="capitalize">{node.status}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-body-medium transition-micro
              ${activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }
            `}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'properties' && (
          <div className="p-4 space-y-4">
            {/* Existing property fields */}
            {Object.keys(formData).length === 0 ? (
              <div className="text-center py-8">
                <Icon name="Settings" size={32} className="text-text-tertiary mx-auto mb-2" />
                <p className="text-text-tertiary">No properties to configure</p>
              </div>
            ) : (
              Object.entries(formData).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-body-medium text-text-primary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {renderPropertyField(key, value, getFieldType(key, value))}
                  {key === 'url' && (
                    <p className="text-xs text-text-tertiary">
                      Use expressions like {"{{$node['Previous Node'].json['field']}}"} for dynamic values
                    </p>
                  )}
                </div>
              ))
            )}

            {/* Add Property Button */}
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 
                           border-2 border-dashed border-border rounded-lg text-text-tertiary 
                           hover:border-primary hover:text-primary transition-micro">
              <Icon name="Plus" size={16} />
              <span>Add Property</span>
            </button>

            {/* Conditional Toggle and Condition Dropdown - moved below font thickness */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="block text-sm font-body-medium text-text-primary">Conditional</label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!node.isConditional}
                  onChange={handleConditionalChange}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm">Enable conditional logic</span>
              </label>
              {node.isConditional && (
                <div>
                  <label className="block text-sm font-body-medium text-text-primary mt-2">Condition</label>
                  <select
                    value={node.condition || 'inactive'}
                    onChange={handleConditionChange}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                    <option value="wip">WIP</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="p-4 space-y-4">
            {/* Input Connections */}
            <div>
              <h4 className="text-sm font-body-medium text-text-primary mb-3">Input Connections</h4>
              {node.inputs?.length > 0 ? (
                <div className="space-y-2">
                  {node.inputs.map(input => (
                    <div key={input.id} className="flex items-center justify-between p-3 
                                                 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-text-tertiary" />
                        <span className="text-sm text-text-primary">{input.label}</span>
                      </div>
                      <span className="text-xs text-text-tertiary">{input.type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-tertiary">No input connections</p>
              )}
            </div>

            {/* Output Connections */}
            <div>
              <h4 className="text-sm font-body-medium text-text-primary mb-3">Output Connections</h4>
              {node.outputs?.length > 0 ? (
                <div className="space-y-2">
                  {node.outputs.map(output => (
                    <div key={output.id} className="flex items-center justify-between p-3 
                                                  bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-text-tertiary" />
                        <span className="text-sm text-text-primary">{output.label}</span>
                      </div>
                      <span className="text-xs text-text-tertiary">{output.type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-tertiary">No output connections</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle2" size={16} />
                <span className="text-sm">Node configuration is valid</span>
              </div>
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle2" size={16} />
                <span className="text-sm">All required fields are filled</span>
              </div>
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle2" size={16} />
                <span className="text-sm">Connection types are compatible</span>
              </div>
            </div>

            {/* Test Button */}
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 
                           bg-primary text-white rounded-lg hover:bg-primary-700 transition-micro">
              <Icon name="Play" size={16} />
              <span>Test Node</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodePropertiesPanel;