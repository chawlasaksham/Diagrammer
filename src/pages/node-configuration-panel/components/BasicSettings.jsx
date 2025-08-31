// src/pages/node-configuration-panel/components/BasicSettings.jsx
import React from 'react';

import FormField from './common/FormField';
import FormSelect from './common/FormSelect';
import FormTextarea from './common/FormTextarea';

const BasicSettings = ({ nodeType, configuration, onChange, errors }) => {
  const httpMethods = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' }
  ];

  const dataFormats = [
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'csv', label: 'CSV' },
    { value: 'text', label: 'Plain Text' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading-semibold text-text-primary mb-1">
          Basic Settings
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Configure the essential settings for this node
        </p>
      </div>

      {/* Node Name */}
      <FormField
        label="Node Name"
        value={configuration.name || ''}
        onChange={(value) => onChange('name', value)}
        placeholder="Enter a descriptive name for this node"
        error={errors['basic.name']}
        required
      />

      {/* Node Description */}
      <FormTextarea
        label="Description"
        value={configuration.description || ''}
        onChange={(value) => onChange('description', value)}
        placeholder="Optional description of what this node does"
        rows={3}
      />

      {/* Node Type Specific Fields */}
      {nodeType === 'api-call' && (
        <>
          <FormField
            label="API Endpoint"
            value={configuration.endpoint || ''}
            onChange={(value) => onChange('endpoint', value)}
            placeholder="https://api.example.com/endpoint"
            error={errors['basic.endpoint']}
            required
            icon="Globe"
          />

          <FormSelect
            label="HTTP Method"
            value={configuration.method || 'GET'}
            onChange={(value) => onChange('method', value)}
            options={httpMethods}
            error={errors['basic.method']}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Timeout (seconds)"
              type="number"
              value={configuration.timeout || 30}
              onChange={(value) => onChange('timeout', parseInt(value) || 30)}
              min={1}
              max={300}
            />
            
            <FormField
              label="Retry Count"
              type="number"
              value={configuration.retryCount || 3}
              onChange={(value) => onChange('retryCount', parseInt(value) || 3)}
              min={0}
              max={10}
            />
          </div>
        </>
      )}

      {nodeType === 'data-transform' && (
        <>
          <FormSelect
            label="Input Format"
            value={configuration.inputFormat || 'json'}
            onChange={(value) => onChange('inputFormat', value)}
            options={dataFormats}
            required
          />

          <FormSelect
            label="Output Format"
            value={configuration.outputFormat || 'json'}
            onChange={(value) => onChange('outputFormat', value)}
            options={dataFormats}
            required
          />

          <FormTextarea
            label="Transform Script"
            value={configuration.transformScript || ''}
            onChange={(value) => onChange('transformScript', value)}
            placeholder="// JavaScript transformation code\nreturn data.map(item => ({ id: item.id, name: item.name }));"
            rows={8}
            error={errors['basic.transformScript']}
            required
            language="javascript"
          />
        </>
      )}

      {nodeType === 'database' && (
        <>
          <FormField
            label="Connection String"
            value={configuration.connectionString || ''}
            onChange={(value) => onChange('connectionString', value)}
            placeholder="postgresql://user:password@host:port/database"
            error={errors['basic.connectionString']}
            required
            type="password"
          />

          <FormTextarea
            label="SQL Query"
            value={configuration.query || ''}
            onChange={(value) => onChange('query', value)}
            placeholder="SELECT * FROM users WHERE active = true"
            rows={6}
            error={errors['basic.query']}
            required
            language="sql"
          />
        </>
      )}

      {nodeType === 'webhook' && (
        <>
          <FormField
            label="Webhook URL"
            value={configuration.webhookUrl || ''}
            onChange={(value) => onChange('webhookUrl', value)}
            placeholder="https://your-app.com/webhook/endpoint"
            error={errors['basic.webhookUrl']}
            required
            icon="Link"
          />

          <FormField
            label="Secret Key"
            value={configuration.secretKey || ''}
            onChange={(value) => onChange('secretKey', value)}
            placeholder="Optional secret for webhook verification"
            type="password"
          />
        </>
      )}

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
        <div>
          <h4 className="font-body-medium text-text-primary">Enable Node</h4>
          <p className="text-sm text-text-secondary">
            Disabled nodes will be skipped during workflow execution
          </p>
        </div>
        <button
          onClick={() => onChange('enabled', !configuration.enabled)}
          className={`
            relative inline-flex items-center h-6 w-11 rounded-full transition-colors
            ${configuration.enabled !== false ? 'bg-success' : 'bg-secondary-300'}
          `}
        >
          <span
            className={`
              inline-block w-4 h-4 transform bg-white rounded-full transition-transform
              ${configuration.enabled !== false ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
};

export default BasicSettings;