// src/pages/node-configuration-panel/components/OutputConfiguration.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import FormField from './common/FormField';
import FormSelect from './common/FormSelect';
import FormTextarea from './common/FormTextarea';

const OutputConfiguration = ({ nodeType, configuration, onChange, errors }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const outputFormats = [
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'csv', label: 'CSV' },
    { value: 'text', label: 'Plain Text' },
    { value: 'binary', label: 'Binary' }
  ];

  const compressionTypes = [
    { value: 'none', label: 'None' },
    { value: 'gzip', label: 'GZIP' },
    { value: 'deflate', label: 'Deflate' },
    { value: 'brotli', label: 'Brotli' }
  ];

  const handleOutputFieldChange = (index, field, value) => {
    const outputFields = [...(configuration.outputFields || [])];
    outputFields[index] = { ...outputFields[index], [field]: value };
    onChange('outputFields', outputFields);
  };

  const addOutputField = () => {
    const outputFields = [...(configuration.outputFields || []), { 
      name: '', 
      type: 'string', 
      description: '',
      required: false
    }];
    onChange('outputFields', outputFields);
  };

  const removeOutputField = (index) => {
    const outputFields = [...(configuration.outputFields || [])];
    outputFields.splice(index, 1);
    onChange('outputFields', outputFields);
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

  const fieldTypes = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'array', label: 'Array' },
    { value: 'object', label: 'Object' },
    { value: 'datetime', label: 'DateTime' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading-semibold text-text-primary mb-1">
          Output Configuration
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Define how this node's output data should be structured and formatted
        </p>
      </div>

      {/* Output Format Settings */}
      <div className="space-y-4">
        <h4 className="font-heading-medium text-text-primary mb-3">Output Format</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Data Format"
            value={configuration.outputFormat || 'json'}
            onChange={(value) => onChange('outputFormat', value)}
            options={outputFormats}
            required
          />
          
          <FormSelect
            label="Compression"
            value={configuration.compression || 'none'}
            onChange={(value) => onChange('compression', value)}
            options={compressionTypes}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Max File Size (MB)"
            type="number"
            value={configuration.maxFileSize || 10}
            onChange={(value) => onChange('maxFileSize', parseInt(value) || 10)}
            min={1}
            max={1000}
          />
          
          <FormField
            label="Chunk Size (KB)"
            type="number"
            value={configuration.chunkSize || 1024}
            onChange={(value) => onChange('chunkSize', parseInt(value) || 1024)}
            min={64}
            max={10240}
          />
          
          <FormField
            label="Encoding"
            value={configuration.encoding || 'utf-8'}
            onChange={(value) => onChange('encoding', value)}
            placeholder="utf-8"
          />
        </div>
      </div>

      {/* Output Fields Definition */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-heading-medium text-text-primary">Output Fields</h4>
          <button
            onClick={addOutputField}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Icon name="Plus" size={16} />
            <span>Add Field</span>
          </button>
        </div>
        
        {(configuration.outputFields || []).length === 0 ? (
          <div className="text-center py-8 bg-secondary-50 rounded-lg border-2 border-dashed border-border">
            <Icon name="FileText" size={32} className="text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary mb-2">No output fields defined</p>
            <p className="text-sm text-text-tertiary mb-4">
              Define the structure of data this node will output
            </p>
            <button
              onClick={addOutputField}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Icon name="Plus" size={16} />
              <span>Add First Field</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {(configuration.outputFields || []).map((field, index) => (
              <div key={index} className="p-4 bg-surface border border-border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getTypeIcon(field.type)} size={18} className="text-primary" />
                    <h5 className="font-body-medium text-text-primary">
                      Output Field {index + 1}
                    </h5>
                  </div>
                  
                  <button
                    onClick={() => removeOutputField(index)}
                    className="p-1 text-text-tertiary hover:text-error transition-colors"
                    title="Remove field"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    label="Field Name"
                    value={field.name || ''}
                    onChange={(value) => handleOutputFieldChange(index, 'name', value)}
                    placeholder="fieldName"
                    required
                  />
                  
                  <FormSelect
                    label="Data Type"
                    value={field.type || 'string'}
                    onChange={(value) => handleOutputFieldChange(index, 'type', value)}
                    options={fieldTypes}
                    required
                  />
                </div>
                
                <FormField
                  label="Description"
                  value={field.description || ''}
                  onChange={(value) => handleOutputFieldChange(index, 'description', value)}
                  placeholder="Describe what this field contains"
                  className="mb-4"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.required || false}
                        onChange={(e) => handleOutputFieldChange(index, 'required', e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text-secondary">Required</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.sensitive || false}
                        onChange={(e) => handleOutputFieldChange(index, 'sensitive', e.target.checked)}
                        className="rounded border-border text-warning focus:ring-warning"
                      />
                      <span className="text-sm text-text-secondary">Sensitive Data</span>
                    </label>
                  </div>
                  
                  {field.type === 'string' && (
                    <FormField
                      label="Max Length"
                      type="number"
                      value={field.maxLength || ''}
                      onChange={(value) => handleOutputFieldChange(index, 'maxLength', parseInt(value) || null)}
                      placeholder="No limit"
                      size="sm"
                      className="w-32"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Output Settings */}
      <div className="space-y-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-primary hover:text-primary-700 transition-colors"
        >
          <Icon name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} size={16} />
          <span className="font-body-medium">Advanced Settings</span>
        </button>
        
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-secondary-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-body-medium text-text-primary">Pretty Print JSON</h5>
                  <p className="text-sm text-text-secondary">
                    Format JSON output with indentation
                  </p>
                </div>
                <button
                  onClick={() => onChange('prettyPrint', !configuration.prettyPrint)}
                  className={`
                    relative inline-flex items-center h-6 w-11 rounded-full transition-colors
                    ${configuration.prettyPrint ? 'bg-primary' : 'bg-secondary-300'}
                  `}
                >
                  <span
                    className={`
                      inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                      ${configuration.prettyPrint ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-body-medium text-text-primary">Include Metadata</h5>
                  <p className="text-sm text-text-secondary">
                    Add execution metadata to output
                  </p>
                </div>
                <button
                  onClick={() => onChange('includeMetadata', !configuration.includeMetadata)}
                  className={`
                    relative inline-flex items-center h-6 w-11 rounded-full transition-colors
                    ${configuration.includeMetadata ? 'bg-primary' : 'bg-secondary-300'}
                  `}
                >
                  <span
                    className={`
                      inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                      ${configuration.includeMetadata ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
            
            <FormTextarea
              label="Custom Output Transform"
              value={configuration.outputTransform || ''}
              onChange={(value) => onChange('outputTransform', value)}
              placeholder="// JavaScript code to transform output data\nreturn { ...data, timestamp: new Date().toISOString() };"
              rows={4}
              language="javascript"
            />
            
            <FormTextarea
              label="Output Validation Schema"
              value={configuration.validationSchema || ''}
              onChange={(value) => onChange('validationSchema', value)}
              placeholder="// JSON Schema for output validation\n{ 'type': 'object', 'properties': { ... } }"
              rows={4}
              language="json"
            />
          </div>
        )}
      </div>

      {/* Output Preview */}
      <div className="space-y-4">
        <h4 className="font-heading-medium text-text-primary mb-3">Output Preview</h4>
        
        <div className="bg-secondary-900 text-green-400 p-4 rounded-lg font-data text-sm overflow-x-auto">
          <pre>
{JSON.stringify({
  status: "success",
  data: configuration.outputFields?.reduce((acc, field) => {
    acc[field.name || 'fieldName'] = `${field.type}_value`;
    return acc;
  }, {}) || { message: "No fields defined" },
  ...(configuration.includeMetadata && {
    metadata: {
      nodeId: "current_node_id",
      executionTime: "2024-01-15T10:30:00Z",
      processingDuration: "245ms"
    }
  })
}, configuration.prettyPrint ? 2 : null)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default OutputConfiguration;