// src/pages/node-configuration-panel/index.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import NodeHeader from './components/NodeHeader';
import ConfigurationTabs from './components/ConfigurationTabs';
import BasicSettings from './components/BasicSettings';
import AdvancedOptions from './components/AdvancedOptions';
import InputMapping from './components/InputMapping';
import OutputConfiguration from './components/OutputConfiguration';
import ConnectionManagement from './components/ConnectionManagement';
import PreviewSection from './components/PreviewSection';
import ActionBar from './components/ActionBar';
import { nodeTypes, getDefaultConfig } from './constants/nodeTypes';

const NodeConfigurationPanel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [configuration, setConfiguration] = useState({});
  const [errors, setErrors] = useState({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Mock node data - in real app, this would come from props or URL params
  const nodeId = searchParams.get('nodeId') || 'api-call-1';
  const nodeType = searchParams.get('nodeType') || 'api-call';
  const workflowId = searchParams.get('workflowId') || 'workflow-1';

  const currentNodeType = nodeTypes[nodeType] || nodeTypes['api-call'];

  useEffect(() => {
    // Initialize with default configuration
    setConfiguration(getDefaultConfig(nodeType));
    setIsVisible(true);
  }, [nodeType]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate(-1); // Go back to previous page
    }, 300);
  };

  const handleConfigurationChange = (section, field, value) => {
    setConfiguration(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear errors for this field
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const validateConfiguration = () => {
    const newErrors = {};
    
    // Basic validation
    if (!configuration.basic?.name?.trim()) {
      newErrors['basic.name'] = 'Node name is required';
    }
    
    if (nodeType === 'api-call') {
      if (!configuration.basic?.endpoint?.trim()) {
        newErrors['basic.endpoint'] = 'API endpoint is required';
      }
      if (!configuration.basic?.method) {
        newErrors['basic.method'] = 'HTTP method is required';
      }
    }
    
    if (nodeType === 'data-transform') {
      if (!configuration.basic?.transformScript?.trim()) {
        newErrors['basic.transformScript'] = 'Transform script is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConfiguration = async () => {
    if (!validateConfiguration()) {
      return;
    }

    setIsTestingConnection(true);
    try {
      // Simulate API call for testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful test result
      setPreviewData({
        status: 'success',
        message: 'Connection test successful',
        sampleData: {
          responseTime: '245ms',
          statusCode: 200,
          dataSize: '2.4KB'
        }
      });
    } catch (error) {
      setPreviewData({
        status: 'error',
        message: 'Connection test failed',
        error: error.message
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = async () => {
    if (!validateConfiguration()) {
      return;
    }

    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving configuration:', {
        nodeId,
        nodeType,
        workflowId,
        configuration
      });
      
      handleClose();
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Settings', icon: 'Settings' },
    { id: 'advanced', label: 'Advanced Options', icon: 'Sliders' },
    { id: 'input', label: 'Input Mapping', icon: 'ArrowDown' },
    { id: 'output', label: 'Output Configuration', icon: 'ArrowUp' },
    { id: 'connections', label: 'Connections', icon: 'Link' }
  ];

  return (
    <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        className={`
          bg-surface rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden
          transform transition-all duration-300 ease-out
          ${
            isVisible 
              ? 'scale-100 opacity-100 translate-y-0' :'scale-95 opacity-0 translate-y-4'
          }
        `}
      >
        {/* Header */}
        <NodeHeader 
          nodeType={currentNodeType}
          nodeName={configuration.basic?.name || currentNodeType.label}
          onClose={handleClose}
        />

        <div className="flex h-[calc(90vh-80px)]">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-64 border-r border-border bg-secondary-50">
            <ConfigurationTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              errors={errors}
            />
          </div>

          {/* Mobile Tab Bar - Visible on mobile */}
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-surface border-b border-border">
            <div className="flex overflow-x-auto px-4 py-2 space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-body-medium whitespace-nowrap
                    transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                    }
                  `}
                >
                  <Icon name={tab.icon} size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:mt-0 mt-16">
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'basic' && (
                <BasicSettings
                  nodeType={nodeType}
                  configuration={configuration.basic || {}}
                  onChange={(field, value) => handleConfigurationChange('basic', field, value)}
                  errors={errors}
                />
              )}
              
              {activeTab === 'advanced' && (
                <AdvancedOptions
                  nodeType={nodeType}
                  configuration={configuration.advanced || {}}
                  onChange={(field, value) => handleConfigurationChange('advanced', field, value)}
                  errors={errors}
                />
              )}
              
              {activeTab === 'input' && (
                <InputMapping
                  nodeType={nodeType}
                  configuration={configuration.input || {}}
                  onChange={(field, value) => handleConfigurationChange('input', field, value)}
                  errors={errors}
                />
              )}
              
              {activeTab === 'output' && (
                <OutputConfiguration
                  nodeType={nodeType}
                  configuration={configuration.output || {}}
                  onChange={(field, value) => handleConfigurationChange('output', field, value)}
                  errors={errors}
                />
              )}
              
              {activeTab === 'connections' && (
                <ConnectionManagement
                  nodeType={nodeType}
                  configuration={configuration.connections || {}}
                  onChange={(field, value) => handleConfigurationChange('connections', field, value)}
                  errors={errors}
                />
              )}

              {/* Preview Section */}
              {(activeTab === 'basic' || activeTab === 'advanced') && (
                <div className="mt-8">
                  <PreviewSection
                    nodeType={nodeType}
                    configuration={configuration}
                    previewData={previewData}
                    isTestingConnection={isTestingConnection}
                    onTest={handleTestConfiguration}
                  />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <ActionBar
              onCancel={handleClose}
              onTest={handleTestConfiguration}
              onSave={handleSave}
              isTestingConnection={isTestingConnection}
              isSaving={isSaving}
              hasErrors={Object.keys(errors).length > 0}
            />
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={handleClose}
        aria-hidden="true"
      />
    </div>
  );
};

export default NodeConfigurationPanel;