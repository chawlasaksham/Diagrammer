// src/pages/node-configuration-panel/components/AdvancedOptions.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import FormField from './common/FormField';
import FormSelect from './common/FormSelect';
import FormTextarea from './common/FormTextarea';

const AdvancedOptions = ({ nodeType, configuration, onChange, errors }) => {
  const [showHeaders, setShowHeaders] = useState(false);
  const [showEnvironmentVars, setShowEnvironmentVars] = useState(false);

  const logLevels = [
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  const executionModes = [
    { value: 'sync', label: 'Synchronous' },
    { value: 'async', label: 'Asynchronous' },
    { value: 'parallel', label: 'Parallel' }
  ];

  const handleHeaderChange = (index, field, value) => {
    const headers = [...(configuration.headers || [])];
    headers[index] = { ...headers[index], [field]: value };
    onChange('headers', headers);
  };

  const addHeader = () => {
    const headers = [...(configuration.headers || []), { key: '', value: '' }];
    onChange('headers', headers);
  };

  const removeHeader = (index) => {
    const headers = [...(configuration.headers || [])];
    headers.splice(index, 1);
    onChange('headers', headers);
  };

  const handleEnvironmentVarChange = (index, field, value) => {
    const envVars = [...(configuration.environmentVars || [])];
    envVars[index] = { ...envVars[index], [field]: value };
    onChange('environmentVars', envVars);
  };

  const addEnvironmentVar = () => {
    const envVars = [...(configuration.environmentVars || []), { key: '', value: '' }];
    onChange('environmentVars', envVars);
  };

  const removeEnvironmentVar = (index) => {
    const envVars = [...(configuration.environmentVars || [])];
    envVars.splice(index, 1);
    onChange('environmentVars', envVars);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading-semibold text-text-primary mb-1">
          Advanced Options
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Configure advanced settings and optimization options
        </p>
      </div>

      {/* Execution Settings */}
      <div className="space-y-4">
        <h4 className="font-heading-medium text-text-primary mb-3">Execution Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Execution Mode"
            value={configuration.executionMode || 'sync'}
            onChange={(value) => onChange('executionMode', value)}
            options={executionModes}
          />
          
          <FormSelect
            label="Log Level"
            value={configuration.logLevel || 'info'}
            onChange={(value) => onChange('logLevel', value)}
            options={logLevels}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Max Memory (MB)"
            type="number"
            value={configuration.maxMemory || 512}
            onChange={(value) => onChange('maxMemory', parseInt(value) || 512)}
            min={128}
            max={4096}
          />
          
          <FormField
            label="Priority"
            type="number"
            value={configuration.priority || 5}
            onChange={(value) => onChange('priority', parseInt(value) || 5)}
            min={1}
            max={10}
          />
          
          <FormField
            label="Parallel Workers"
            type="number"
            value={configuration.parallelWorkers || 1}
            onChange={(value) => onChange('parallelWorkers', parseInt(value) || 1)}
            min={1}
            max={10}
          />
        </div>
      </div>

      {/* HTTP Headers (for API nodes) */}
      {(nodeType === 'api-call' || nodeType === 'webhook') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading-medium text-text-primary">HTTP Headers</h4>
            <button
              onClick={() => setShowHeaders(!showHeaders)}
              className="text-sm text-primary hover:text-primary-700 flex items-center space-x-1"
            >
              <Icon name={showHeaders ? 'ChevronUp' : 'ChevronDown'} size={16} />
              <span>{showHeaders ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          
          {showHeaders && (
            <div className="space-y-3">
              {(configuration.headers || []).map((header, index) => (
                <div key={index} className="flex items-end space-x-2">
                  <div className="flex-1">
                    <FormField
                      label={index === 0 ? 'Header Name' : ''}
                      value={header.key || ''}
                      onChange={(value) => handleHeaderChange(index, 'key', value)}
                      placeholder="Content-Type"
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      label={index === 0 ? 'Header Value' : ''}
                      value={header.value || ''}
                      onChange={(value) => handleHeaderChange(index, 'value', value)}
                      placeholder="application/json"
                    />
                  </div>
                  <button
                    onClick={() => removeHeader(index)}
                    className="p-2 text-error hover:bg-error-50 rounded-lg transition-colors mb-2"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              ))}
              
              <button
                onClick={addHeader}
                className="flex items-center space-x-2 text-sm text-primary hover:text-primary-700"
              >
                <Icon name="Plus" size={16} />
                <span>Add Header</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Environment Variables */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-heading-medium text-text-primary">Environment Variables</h4>
          <button
            onClick={() => setShowEnvironmentVars(!showEnvironmentVars)}
            className="text-sm text-primary hover:text-primary-700 flex items-center space-x-1"
          >
            <Icon name={showEnvironmentVars ? 'ChevronUp' : 'ChevronDown'} size={16} />
            <span>{showEnvironmentVars ? 'Hide' : 'Show'}</span>
          </button>
        </div>
        
        {showEnvironmentVars && (
          <div className="space-y-3">
            {(configuration.environmentVars || []).map((envVar, index) => (
              <div key={index} className="flex items-end space-x-2">
                <div className="flex-1">
                  <FormField
                    label={index === 0 ? 'Variable Name' : ''}
                    value={envVar.key || ''}
                    onChange={(value) => handleEnvironmentVarChange(index, 'key', value)}
                    placeholder="API_KEY"
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    label={index === 0 ? 'Variable Value' : ''}
                    value={envVar.value || ''}
                    onChange={(value) => handleEnvironmentVarChange(index, 'value', value)}
                    placeholder="${API_KEY}"
                    type="password"
                  />
                </div>
                <button
                  onClick={() => removeEnvironmentVar(index)}
                  className="p-2 text-error hover:bg-error-50 rounded-lg transition-colors mb-2"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            ))}
            
            <button
              onClick={addEnvironmentVar}
              className="flex items-center space-x-2 text-sm text-primary hover:text-primary-700"
            >
              <Icon name="Plus" size={16} />
              <span>Add Variable</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Handling */}
      <div className="space-y-4">
        <h4 className="font-heading-medium text-text-primary mb-3">Error Handling</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div>
              <h5 className="font-body-medium text-text-primary">Continue on Error</h5>
              <p className="text-sm text-text-secondary">
                Continue workflow execution even if this node fails
              </p>
            </div>
            <button
              onClick={() => onChange('continueOnError', !configuration.continueOnError)}
              className={`
                relative inline-flex items-center h-6 w-11 rounded-full transition-colors
                ${configuration.continueOnError ? 'bg-warning' : 'bg-secondary-300'}
              `}
            >
              <span
                className={`
                  inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                  ${configuration.continueOnError ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div>
              <h5 className="font-body-medium text-text-primary">Enable Caching</h5>
              <p className="text-sm text-text-secondary">
                Cache results to improve performance
              </p>
            </div>
            <button
              onClick={() => onChange('enableCaching', !configuration.enableCaching)}
              className={`
                relative inline-flex items-center h-6 w-11 rounded-full transition-colors
                ${configuration.enableCaching ? 'bg-success' : 'bg-secondary-300'}
              `}
            >
              <span
                className={`
                  inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                  ${configuration.enableCaching ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        {configuration.enableCaching && (
          <FormField
            label="Cache Duration (minutes)"
            type="number"
            value={configuration.cacheDuration || 60}
            onChange={(value) => onChange('cacheDuration', parseInt(value) || 60)}
            min={1}
            max={10080}
          />
        )}
      </div>

      {/* Custom Scripts */}
      <div className="space-y-4">
        <h4 className="font-heading-medium text-text-primary mb-3">Custom Scripts</h4>
        
        <FormTextarea
          label="Pre-execution Script"
          value={configuration.preExecutionScript || ''}
          onChange={(value) => onChange('preExecutionScript', value)}
          placeholder="// JavaScript code to run before node execution"
          rows={4}
          language="javascript"
        />
        
        <FormTextarea
          label="Post-execution Script"
          value={configuration.postExecutionScript || ''}
          onChange={(value) => onChange('postExecutionScript', value)}
          placeholder="// JavaScript code to run after node execution"
          rows={4}
          language="javascript"
        />
      </div>
    </div>
  );
};

export default AdvancedOptions;