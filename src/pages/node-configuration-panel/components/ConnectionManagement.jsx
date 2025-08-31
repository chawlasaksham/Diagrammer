// src/pages/node-configuration-panel/components/ConnectionManagement.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import FormSelect from './common/FormSelect';

const ConnectionManagement = ({ nodeType, configuration, onChange, errors }) => {
  const [selectedPort, setSelectedPort] = useState(null);

  // Mock data for available connections
  const availableNodes = [
    { id: 'user-data-1', name: 'User Data Source', type: 'data-source', outputs: ['user_id', 'email', 'profile'] },
    { id: 'api-call-1', name: 'Authentication API', type: 'api-call', outputs: ['token', 'expires_at', 'permissions'] },
    { id: 'transform-1', name: 'Data Transformer', type: 'data-transform', outputs: ['processed_data', 'metadata'] },
    { id: 'database-1', name: 'User Database', type: 'database', outputs: ['query_result', 'row_count'] }
  ];

  // Mock input/output ports for current node
  const getNodePorts = () => {
    switch (nodeType) {
      case 'api-call':
        return {
          inputs: [
            { id: 'url', label: 'API URL', type: 'string', required: true },
            { id: 'headers', label: 'Headers', type: 'object', required: false },
            { id: 'body', label: 'Request Body', type: 'object', required: false },
            { id: 'auth', label: 'Authentication', type: 'object', required: false }
          ],
          outputs: [
            { id: 'response', label: 'API Response', type: 'object' },
            { id: 'status_code', label: 'Status Code', type: 'number' },
            { id: 'headers', label: 'Response Headers', type: 'object' },
            { id: 'execution_time', label: 'Execution Time', type: 'number' }
          ]
        };
      case 'data-transform':
        return {
          inputs: [
            { id: 'input_data', label: 'Input Data', type: 'any', required: true },
            { id: 'transform_rules', label: 'Transform Rules', type: 'object', required: false }
          ],
          outputs: [
            { id: 'transformed_data', label: 'Transformed Data', type: 'any' },
            { id: 'transform_log', label: 'Transform Log', type: 'array' }
          ]
        };
      case 'database':
        return {
          inputs: [
            { id: 'query', label: 'SQL Query', type: 'string', required: true },
            { id: 'parameters', label: 'Query Parameters', type: 'object', required: false }
          ],
          outputs: [
            { id: 'result_set', label: 'Query Results', type: 'array' },
            { id: 'row_count', label: 'Affected Rows', type: 'number' },
            { id: 'execution_plan', label: 'Execution Plan', type: 'object' }
          ]
        };
      default:
        return {
          inputs: [
            { id: 'input', label: 'Input Data', type: 'any', required: true }
          ],
          outputs: [
            { id: 'output', label: 'Output Data', type: 'any' }
          ]
        };
    }
  };

  const ports = getNodePorts();
  const connections = configuration.connections || { inputs: {}, outputs: {} };

  const handleInputConnection = (portId, sourceNodeId, sourcePort) => {
    const newConnections = {
      ...connections,
      inputs: {
        ...connections.inputs,
        [portId]: sourceNodeId && sourcePort ? { sourceNodeId, sourcePort } : null
      }
    };
    onChange('connections', newConnections);
  };

  const handleOutputConnection = (portId, targetNodes) => {
    const newConnections = {
      ...connections,
      outputs: {
        ...connections.outputs,
        [portId]: targetNodes
      }
    };
    onChange('connections', newConnections);
  };

  const getPortTypeIcon = (type) => {
    switch (type) {
      case 'string': return 'Type';
      case 'number': return 'Hash';
      case 'boolean': return 'ToggleLeft';
      case 'array': return 'List';
      case 'object': return 'Package';
      case 'any': return 'HelpCircle';
      default: return 'Circle';
    }
  };

  const getPortTypeColor = (type) => {
    switch (type) {
      case 'string': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'number': return 'text-green-600 bg-green-50 border-green-200';
      case 'boolean': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'array': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'object': return 'text-red-600 bg-red-50 border-red-200';
      case 'any': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isPortConnected = (portId, isInput = true) => {
    if (isInput) {
      return !!connections.inputs?.[portId];
    } else {
      return !!(connections.outputs?.[portId]?.length > 0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading-semibold text-text-primary mb-1">
          Connection Management
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Configure input and output connections for this node
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Ports */}
        <div className="space-y-4">
          <h4 className="font-heading-medium text-text-primary flex items-center space-x-2">
            <Icon name="ArrowDown" size={18} className="text-primary" />
            <span>Input Ports</span>
          </h4>
          
          <div className="space-y-3">
            {ports.inputs.map((port) => {
              const connection = connections.inputs?.[port.id];
              const isConnected = !!connection;
              
              return (
                <div 
                  key={port.id}
                  className={`
                    p-4 border rounded-lg transition-colors
                    ${
                      isConnected 
                        ? 'border-success bg-success-50' 
                        : port.required 
                          ? 'border-error bg-error-50' :'border-border bg-surface'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center
                        ${getPortTypeColor(port.type)}
                      `}>
                        <Icon name={getPortTypeIcon(port.type)} size={16} />
                      </div>
                      <div>
                        <div className="font-body-medium text-text-primary">
                          {port.label}
                          {port.required && <span className="text-error ml-1">*</span>}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          Type: {port.type}
                        </div>
                      </div>
                    </div>
                    
                    {isConnected && (
                      <button
                        onClick={() => handleInputConnection(port.id, null, null)}
                        className="p-1 text-text-tertiary hover:text-error transition-colors"
                        title="Disconnect"
                      >
                        <Icon name="Unlink" size={16} />
                      </button>
                    )}
                  </div>
                  
                  {isConnected ? (
                    <div className="flex items-center space-x-2 p-3 bg-surface rounded-lg border border-success">
                      <Icon name="Link" size={16} className="text-success" />
                      <span className="text-sm font-body-medium text-text-primary">
                        Connected to: {availableNodes.find(n => n.id === connection.sourceNodeId)?.name || 'Unknown'}
                      </span>
                      <span className="text-xs text-text-tertiary px-2 py-1 bg-secondary-100 rounded">
                        {connection.sourcePort}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormSelect
                        label="Source Node"
                        value={''}
                        onChange={(nodeId) => {
                          if (nodeId) {
                            const node = availableNodes.find(n => n.id === nodeId);
                            if (node && node.outputs.length > 0) {
                              handleInputConnection(port.id, nodeId, node.outputs[0]);
                            }
                          }
                        }}
                        options={[
                          { value: '', label: 'Select source node...' },
                          ...availableNodes.map(node => ({ 
                            value: node.id, 
                            label: `${node.name} (${node.type})`
                          }))
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

        {/* Output Ports */}
        <div className="space-y-4">
          <h4 className="font-heading-medium text-text-primary flex items-center space-x-2">
            <Icon name="ArrowUp" size={18} className="text-accent" />
            <span>Output Ports</span>
          </h4>
          
          <div className="space-y-3">
            {ports.outputs.map((port) => {
              const connections_out = connections.outputs?.[port.id] || [];
              const isConnected = connections_out.length > 0;
              
              return (
                <div 
                  key={port.id}
                  className={`
                    p-4 border rounded-lg transition-colors
                    ${
                      isConnected 
                        ? 'border-accent bg-accent-50' :'border-border bg-surface'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center
                        ${getPortTypeColor(port.type)}
                      `}>
                        <Icon name={getPortTypeIcon(port.type)} size={16} />
                      </div>
                      <div>
                        <div className="font-body-medium text-text-primary">
                          {port.label}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          Type: {port.type}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isConnected && (
                        <span className="text-xs text-accent bg-accent-100 px-2 py-1 rounded">
                          {connections_out.length} connection{connections_out.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isConnected ? (
                    <div className="space-y-2">
                      {connections_out.map((conn, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-surface rounded border border-accent">
                          <div className="flex items-center space-x-2">
                            <Icon name="ArrowRight" size={14} className="text-accent" />
                            <span className="text-sm text-text-primary">
                              {availableNodes.find(n => n.id === conn.targetNodeId)?.name || 'Unknown Node'}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const newConnections = connections_out.filter((_, i) => i !== index);
                              handleOutputConnection(port.id, newConnections);
                            }}
                            className="p-1 text-text-tertiary hover:text-error transition-colors"
                          >
                            <Icon name="X" size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Icon name="ArrowUpRight" size={24} className="text-text-tertiary mx-auto mb-2" />
                      <p className="text-sm text-text-tertiary">
                        This output is not connected to any nodes
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Connection Summary */}
      <div className="bg-secondary-50 rounded-lg p-4">
        <h5 className="font-heading-medium text-text-primary mb-3 flex items-center space-x-2">
          <Icon name="GitBranch" size={16} />
          <span>Connection Summary</span>
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h6 className="text-sm font-body-medium text-text-secondary mb-2">Input Connections</h6>
            <div className="space-y-1">
              {ports.inputs.map((port) => {
                const connection = connections.inputs?.[port.id];
                const isConnected = !!connection;
                
                return (
                  <div key={port.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{port.label}</span>
                    <span className={isConnected ? 'text-success' : port.required ? 'text-error' : 'text-text-tertiary'}>
                      {isConnected ? '✓ Connected' : port.required ? '✗ Required' : '○ Optional'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h6 className="text-sm font-body-medium text-text-secondary mb-2">Output Connections</h6>
            <div className="space-y-1">
              {ports.outputs.map((port) => {
                const connections_out = connections.outputs?.[port.id] || [];
                const count = connections_out.length;
                
                return (
                  <div key={port.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{port.label}</span>
                    <span className={count > 0 ? 'text-accent' : 'text-text-tertiary'}>
                      {count > 0 ? `${count} connection${count !== 1 ? 's' : ''}` : 'Not connected'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionManagement;