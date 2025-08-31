import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CanvasToolbar = ({
  workflowName,
  workflowStatus,
  hasUnsavedChanges,
  canvasZoom,
  onSave,
  onRun,
  onStop,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onCenter,
  onNameChange
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(workflowName);

  const handleNameSubmit = () => {
    onNameChange(tempName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(workflowName);
    setIsEditingName(false);
  };

  const getStatusConfig = () => {
    switch (workflowStatus) {
      case 'running':
        return { color: 'text-success', bg: 'bg-success-50', icon: 'Play', label: 'Running' };
      case 'completed':
        return { color: 'text-success', bg: 'bg-success-50', icon: 'CheckCircle2', label: 'Completed' };
      case 'error':
        return { color: 'text-error', bg: 'bg-error-50', icon: 'AlertTriangle', label: 'Error' };
      case 'paused':
        return { color: 'text-warning', bg: 'bg-warning-50', icon: 'Pause', label: 'Paused' };
      default:
        return { color: 'text-text-tertiary', bg: 'bg-secondary-100', icon: 'Circle', label: 'Idle' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="bg-surface border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Workflow Info */}
        <div className="flex items-center space-x-4">
          {/* Workflow Name */}
          <div className="flex items-center space-x-2">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSubmit();
                    if (e.key === 'Escape') handleNameCancel();
                  }}
                  className="px-2 py-1 text-lg font-heading-medium border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={handleNameSubmit}
                  className="p-1 text-success hover:bg-success-50 rounded transition-micro"
                >
                  <Icon name="Check" size={16} />
                </button>
                <button
                  onClick={handleNameCancel}
                  className="p-1 text-error hover:bg-error-50 rounded transition-micro"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-secondary-50 transition-micro"
              >
                <h2 className="text-lg font-heading-medium text-text-primary">Editor</h2>
                <Icon name="Edit2" size={14} className="text-text-tertiary" />
              </button>
            )}
          </div>

          {/* Status Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${statusConfig.bg}`}>
            <Icon 
              name={statusConfig.icon} 
              size={14} 
              className={`${statusConfig.color} ${workflowStatus === 'running' ? 'pulse-subtle' : ''}`} 
            />
            <span className={`text-sm font-body-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-1 text-warning">
              <Icon name="AlertCircle" size={14} />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
        </div>

        {/* Center Section - Canvas Controls */}
        <div className="hidden lg:flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-secondary-50 rounded-lg p-1">
            <button
              onClick={onZoomOut}
              className="p-2 hover:bg-surface rounded transition-micro"
              title="Zoom Out"
            >
              <Icon name="Minus" size={16} className="text-text-secondary" />
            </button>
            
            <span className="px-3 py-1 text-sm font-body-medium text-text-primary min-w-16 text-center">
              {Math.round(canvasZoom * 100)}%
            </span>
            
            <button
              onClick={onZoomIn}
              className="p-2 hover:bg-surface rounded transition-micro"
              title="Zoom In"
            >
              <Icon name="Plus" size={16} className="text-text-secondary" />
            </button>
          </div>

          {/* Canvas Navigation */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onZoomFit}
              className="p-2 hover:bg-secondary-50 rounded transition-micro"
              title="Fit to Screen"
            >
              <Icon name="Maximize2" size={16} className="text-text-secondary" />
            </button>
            
            <button
              onClick={onCenter}
              className="p-2 hover:bg-secondary-50 rounded transition-micro"
              title="Center Canvas"
            >
              <Icon name="Home" size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Undo/Redo */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              className="p-2 hover:bg-secondary-50 rounded transition-micro opacity-50 cursor-not-allowed"
              title="Undo (Ctrl+Z)"
              disabled
            >
              <Icon name="Undo2" size={16} className="text-text-secondary" />
            </button>
            
            <button
              className="p-2 hover:bg-secondary-50 rounded transition-micro opacity-50 cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
              disabled
            >
              <Icon name="Redo2" size={16} className="text-text-secondary" />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-body-medium transition-micro
              ${hasUnsavedChanges
                ? 'bg-secondary-100 text-text-primary hover:bg-secondary-200' :'bg-secondary-50 text-text-tertiary cursor-not-allowed'
              }
            `}
            title="Save Workflow (Ctrl+S)"
          >
            <Icon name="Save" size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* More Actions */}
          <div className="relative">
            <button className="p-2 hover:bg-secondary-50 rounded transition-micro">
              <Icon name="MoreVertical" size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Canvas Controls */}
      <div className="lg:hidden mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onZoomOut}
              className="p-2 bg-secondary-50 rounded transition-micro"
            >
              <Icon name="Minus" size={16} className="text-text-secondary" />
            </button>
            
            <span className="px-3 py-1 text-sm bg-secondary-50 rounded">
              {Math.round(canvasZoom * 100)}%
            </span>
            
            <button
              onClick={onZoomIn}
              className="p-2 bg-secondary-50 rounded transition-micro"
            >
              <Icon name="Plus" size={16} className="text-text-secondary" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onZoomFit}
              className="p-2 bg-secondary-50 rounded transition-micro"
            >
              <Icon name="Maximize2" size={16} className="text-text-secondary" />
            </button>
            
            <button
              onClick={onCenter}
              className="p-2 bg-secondary-50 rounded transition-micro"
            >
              <Icon name="Home" size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;