// src/pages/node-configuration-panel/components/PreviewSection.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const PreviewSection = ({ 
  nodeType, 
  configuration, 
  previewData, 
  isTestingConnection, 
  onTest 
}) => {
  const canTest = () => {
    // Basic validation to determine if test is possible
    switch (nodeType) {
      case 'api-call':
        return configuration.basic?.endpoint && configuration.basic?.method;
      case 'database':
        return configuration.basic?.connectionString && configuration.basic?.query;
      case 'webhook':
        return configuration.basic?.webhookUrl;
      default:
        return true;
    }
  };

  const getTestButtonText = () => {
    if (isTestingConnection) {
      return 'Testing...';
    }
    
    switch (nodeType) {
      case 'api-call':
        return 'Test API Call';
      case 'database':
        return 'Test Query';
      case 'webhook':
        return 'Test Webhook';
      default:
        return 'Test Configuration';
    }
  };

  const renderTestResults = () => {
    if (!previewData) return null;

    const { status, message, sampleData, error } = previewData;

    return (
      <div className={`
        p-4 rounded-lg border
        ${
          status === 'success' ?'bg-success-50 border-success text-success-700' :'bg-error-50 border-error text-error-700'
        }
      `}>
        <div className="flex items-start space-x-3">
          <Icon 
            name={status === 'success' ? 'CheckCircle2' : 'AlertCircle'} 
            size={20}
            className={status === 'success' ? 'text-success' : 'text-error'}
          />
          <div className="flex-1">
            <h4 className="font-body-medium mb-1">
              {status === 'success' ? 'Test Successful' : 'Test Failed'}
            </h4>
            <p className="text-sm mb-3">{message}</p>
            
            {status === 'success' && sampleData && (
              <div className="space-y-3">
                <h5 className="font-body-medium text-sm">Sample Response:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(sampleData).map(([key, value]) => (
                    <div key={key} className="bg-white bg-opacity-50 p-2 rounded">
                      <div className="font-data text-text-tertiary">{key}</div>
                      <div className="font-data font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {status === 'error' && error && (
              <div className="bg-white bg-opacity-50 p-3 rounded font-data text-xs">
                <pre className="whitespace-pre-wrap">{error}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConfigurationPreview = () => {
    const preview = {};
    
    // Build preview based on node type and current configuration
    switch (nodeType) {
      case 'api-call':
        preview.method = configuration.basic?.method || 'GET';
        preview.endpoint = configuration.basic?.endpoint || 'No endpoint configured';
        preview.timeout = `${configuration.basic?.timeout || 30}s`;
        preview.retries = configuration.basic?.retryCount || 3;
        if (configuration.advanced?.headers?.length > 0) {
          preview.headers = configuration.advanced.headers.length;
        }
        break;
        
      case 'data-transform':
        preview.inputFormat = configuration.basic?.inputFormat || 'json';
        preview.outputFormat = configuration.basic?.outputFormat || 'json';
        preview.hasScript = !!configuration.basic?.transformScript;
        break;
        
      case 'database':
        preview.hasConnection = !!configuration.basic?.connectionString;
        preview.hasQuery = !!configuration.basic?.query;
        break;
        
      case 'webhook':
        preview.url = configuration.basic?.webhookUrl || 'No URL configured';
        preview.hasSecret = !!configuration.basic?.secretKey;
        break;
        
      default:
        preview.name = configuration.basic?.name || 'Unnamed node';
        preview.enabled = configuration.basic?.enabled !== false;
    }

    return (
      <div className="bg-secondary-900 text-green-400 p-4 rounded-lg font-data text-sm">
        <div className="text-secondary-300 mb-2"># Configuration Preview</div>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(preview, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-heading-medium text-text-primary mb-1">
            Configuration Preview & Testing
          </h4>
          <p className="text-sm text-text-secondary">
            Test your configuration and preview the expected behavior
          </p>
        </div>
        
        <button
          onClick={onTest}
          disabled={!canTest() || isTestingConnection}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg font-body-medium transition-colors
            ${
              canTest() && !isTestingConnection
                ? 'bg-primary text-white hover:bg-primary-700' :'bg-secondary-200 text-text-tertiary cursor-not-allowed'
            }
          `}
        >
          {isTestingConnection ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <>
              <Icon name="Play" size={16} />
              <span>{getTestButtonText()}</span>
            </>
          )}
        </button>
      </div>

      {/* Test Results */}
      {renderTestResults()}

      {/* Configuration Preview */}
      <div>
        <h5 className="font-body-medium text-text-primary mb-3">Current Configuration</h5>
        {renderConfigurationPreview()}
      </div>

      {/* Validation Status */}
      <div className="bg-secondary-50 rounded-lg p-4">
        <h5 className="font-body-medium text-text-primary mb-3 flex items-center space-x-2">
          <Icon name="CheckSquare" size={16} />
          <span>Validation Status</span>
        </h5>
        
        <div className="space-y-2">
          {[
            {
              check: 'Node name configured',
              valid: !!configuration.basic?.name,
              required: true
            },
            {
              check: 'Basic settings complete',
              valid: canTest(),
              required: true
            },
            {
              check: 'Input mappings defined',
              valid: !!configuration.input?.fieldMappings && Object.keys(configuration.input.fieldMappings).length > 0,
              required: false
            },
            {
              check: 'Output format specified',
              valid: !!configuration.output?.outputFormat,
              required: false
            },
            {
              check: 'Connections configured',
              valid: !!configuration.connections?.inputs && Object.keys(configuration.connections.inputs).length > 0,
              required: false
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-text-primary">{item.check}</span>
              <div className="flex items-center space-x-2">
                {item.required && !item.valid && (
                  <span className="text-xs text-error bg-error-50 px-2 py-1 rounded">
                    Required
                  </span>
                )}
                <Icon 
                  name={item.valid ? 'CheckCircle2' : 'AlertCircle'} 
                  size={16} 
                  className={item.valid ? 'text-success' : item.required ? 'text-error' : 'text-text-tertiary'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {!canTest() && (
        <div className="bg-warning-50 border border-warning rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-body-medium text-warning-700 mb-1">
                Configuration Incomplete
              </h5>
              <p className="text-sm text-warning-600">
                Complete the required basic settings to enable configuration testing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;