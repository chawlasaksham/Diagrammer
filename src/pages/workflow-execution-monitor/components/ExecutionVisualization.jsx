import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExecutionVisualization = ({ 
  workflow, 
  currentStep, 
  onNodeSelect, 
  selectedNode 
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });

  if (!workflow) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <Icon name="Activity" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a workflow to view execution visualization</p>
        </div>
      </div>
    );
  }

  const getNodeStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white border-success';
      case 'running':
        return 'bg-warning text-white border-warning pulse-subtle';
      case 'error':
        return 'bg-error text-white border-error';
      case 'pending':
        return 'bg-secondary-100 text-text-secondary border-secondary-300';
      default:
        return 'bg-secondary-100 text-text-secondary border-secondary-300';
    }
  };

  const getNodeIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle2';
      case 'running':
        return 'Play';
      case 'error':
        return 'AlertCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetView = () => {
    setZoomLevel(100);
    setPanPosition({ x: 0, y: 0 });
  };

  return (
    <div className="h-full relative bg-secondary-50">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <div className="bg-surface border border-border rounded-lg shadow-subtle p-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleZoomIn}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded transition-micro"
            >
              <Icon name="ZoomIn" size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded transition-micro"
            >
              <Icon name="ZoomOut" size={16} />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded transition-micro"
            >
              <Icon name="RotateCcw" size={16} />
            </button>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg shadow-subtle px-3 py-2">
          <span className="text-xs text-text-secondary">{zoomLevel}%</span>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div 
        className="h-full overflow-auto p-8"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
      >
        <div className="relative min-w-max">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Workflow Nodes */}
          <div className="relative">
            {workflow.nodes.map((node, index) => (
              <div key={node.id} className="relative">
                {/* Connection Line */}
                {index < workflow.nodes.length - 1 && (
                  <div 
                    className="absolute top-1/2 left-full w-16 h-0.5 bg-secondary-300 z-0"
                    style={{ 
                      transform: 'translateY(-50%)',
                      marginLeft: '1rem'
                    }}
                  />
                )}

                {/* Node */}
                <div
                  className={`
                    relative inline-flex flex-col items-center mr-16 mb-8 cursor-pointer
                    ${index === 0 ? '' : 'ml-16'}
                  `}
                  onClick={() => onNodeSelect(node.id)}
                >
                  {/* Node Circle */}
                  <div
                    className={`
                      w-16 h-16 rounded-full border-2 flex items-center justify-center
                      transition-micro hover-scale z-10
                      ${getNodeStatusColor(node.status)}
                      ${selectedNode === node.id ? 'ring-4 ring-primary ring-opacity-30' : ''}
                    `}
                  >
                    <Icon name={getNodeIcon(node.status)} size={24} />
                  </div>

                  {/* Node Label */}
                  <div className="mt-3 text-center max-w-32">
                    <p className="text-sm font-body-medium text-text-primary mb-1">
                      {node.name}
                    </p>
                    {node.duration && (
                      <p className="text-xs text-text-tertiary">
                        {node.duration}
                      </p>
                    )}
                  </div>

                  {/* Node Details Tooltip */}
                  {selectedNode === node.id && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-20">
                      <div className="bg-surface border border-border rounded-lg shadow-modal p-4 min-w-64">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-body-semibold text-text-primary">
                            {node.name}
                          </h4>
                          <span className={`
                            px-2 py-1 rounded text-xs font-body-medium capitalize
                            ${node.status === 'completed' ? 'bg-success-50 text-success' :
                              node.status === 'running' ? 'bg-warning-50 text-warning' :
                              node.status === 'error'? 'bg-error-50 text-error' : 'bg-secondary-100 text-text-secondary'}
                          `}>
                            {node.status}
                          </span>
                        </div>
                        
                        {node.duration && (
                          <div className="mb-2">
                            <span className="text-xs text-text-secondary">Duration: </span>
                            <span className="text-xs text-text-primary">{node.duration}</span>
                          </div>
                        )}
                        
                        {node.data && (
                          <div>
                            <span className="text-xs text-text-secondary">Data: </span>
                            <pre className="text-xs text-text-primary bg-secondary-50 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(node.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-body-medium text-text-primary">
                Execution Progress
              </span>
              <span className="text-sm text-text-secondary">
                {workflow.currentStep} of {workflow.totalSteps} steps
              </span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${workflow.progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-tertiary">
              <span>Started: {workflow.startTime.toLocaleTimeString()}</span>
              <span>Duration: {workflow.executionTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionVisualization;