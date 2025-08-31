import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ContextToolbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const getToolbarConfig = () => {
    switch (location.pathname) {
      case '/visual-workflow-editor':
        return {
          title: 'Editor',
          actions: [
            {
              label: 'Save',
              icon: 'Save',
              variant: 'secondary',
              onClick: () => setHasUnsavedChanges(false),
              disabled: !hasUnsavedChanges
            }
          ],
          status: hasUnsavedChanges ? 'modified' : 'saved',
          showUndoRedo: true
        };

      case '/node-configuration-panel':
        return {
          title: 'Node Configuration',
          actions: [
            {
              label: 'Apply',
              icon: 'Check',
              variant: 'primary',
              onClick: () => console.log('Apply configuration')
            },
            {
              label: 'Reset',
              icon: 'RotateCcw',
              variant: 'secondary',
              onClick: () => console.log('Reset configuration')
            }
          ],
          status: 'configuring'
        };

      case '/workflow-execution-monitor':
        return {
          title: 'Execution Monitor',
          actions: [
            {
              label: isExecuting ? 'Stop' : 'Start',
              icon: isExecuting ? 'Square' : 'Play',
              variant: isExecuting ? 'error' : 'success',
              onClick: () => setIsExecuting(!isExecuting)
            },
            {
              label: 'Pause',
              icon: 'Pause',
              variant: 'warning',
              onClick: () => console.log('Pause execution'),
              disabled: !isExecuting
            },
            {
              label: 'Refresh',
              icon: 'RefreshCw',
              variant: 'secondary',
              onClick: () => console.log('Refresh monitor')
            }
          ],
          status: isExecuting ? 'running' : 'stopped'
        };

      default:
        return null;
    }
  };

  const config = getToolbarConfig();

  if (!config) return null;

  const getStatusIndicator = () => {
    const statusConfig = {
      saved: { color: 'text-success', bg: 'bg-success-50', icon: 'CheckCircle2' },
      modified: { color: 'text-warning', bg: 'bg-warning-50', icon: 'AlertCircle' },
      running: { color: 'text-success', bg: 'bg-success-50', icon: 'Play', pulse: true },
      stopped: { color: 'text-text-tertiary', bg: 'bg-secondary-100', icon: 'Square' },
      configuring: { color: 'text-accent', bg: 'bg-accent-50', icon: 'Settings' }
    };

    const status = statusConfig[config.status] || statusConfig.saved;

    return (
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${status.bg}`}>
        <Icon 
          name={status.icon} 
          size={16} 
          className={`${status.color} ${status.pulse ? 'pulse-subtle' : ''}`} 
        />
        <span className={`text-sm font-body-medium ${status.color} capitalize`}>
          {config.status}
        </span>
      </div>
    );
  };

  const getButtonVariant = (variant) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-700 focus:ring-primary',
      secondary: 'bg-secondary-100 text-text-primary hover:bg-secondary-200 focus:ring-secondary',
      accent: 'bg-accent text-white hover:bg-accent-600 focus:ring-accent',
      success: 'bg-success text-white hover:bg-success-500 focus:ring-success',
      warning: 'bg-warning text-white hover:bg-warning-500 focus:ring-warning',
      error: 'bg-error text-white hover:bg-error-500 focus:ring-error'
    };
    return variants[variant] || variants.secondary;
  };

  return (
    <div className="sticky top-16 z-toolbar bg-surface border-b border-border shadow-subtle">
      <div className="max-w-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-14" style={{marginBottom: 0, paddingBottom: 0}}>
          {/* Left Side - Title and Status */}
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-heading-medium text-text-primary">
              {config.title}
            </h2>
            {getStatusIndicator()}
            {config.showUndoRedo && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  className="p-2 hover:bg-secondary-50 rounded transition-micro"
                  title="Undo (Ctrl+Z)"
                  onClick={typeof window.onUndo === 'function' ? window.onUndo : undefined}
                  disabled={typeof window.canUndo !== 'undefined' && !window.canUndo}
                >
                  <Icon name="Undo2" size={20} className="text-primary" />
                </button>
                <button
                  className="p-2 hover:bg-secondary-50 rounded transition-micro"
                  title="Redo (Ctrl+Shift+Z)"
                  onClick={typeof window.onRedo === 'function' ? window.onRedo : undefined}
                  disabled={typeof window.canRedo !== 'undefined' && !window.canRedo}
                >
                  <Icon name="Redo2" size={20} className="text-primary" />
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {config.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-body-medium
                    transition-micro hover-scale focus:outline-none focus:ring-2 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    ${getButtonVariant(action.variant)}
                  `}
                >
                  <Icon name={action.icon} size={16} />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Actions - Dropdown */}
            <div className="sm:hidden relative">
              <button className="flex items-center space-x-1 px-3 py-2 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-micro">
                <Icon name="MoreVertical" size={16} />
                <span className="text-sm">Actions</span>
              </button>
            </div>

            {/* Breadcrumb Navigation for Editor Context */}
            {(location.pathname === '/visual-workflow-editor' || location.pathname === '/node-configuration-panel') && (
              <div className="hidden lg:flex items-center space-x-2 ml-4 pl-4 border-l border-border">
                <button
                  className="flex items-center space-x-1 px-2 py-1 text-sm text-text-secondary hover:text-text-primary transition-micro"
                  onClick={() => navigate('/diagram-dashboard')}
                >
                  <Icon name="ArrowLeft" size={14} />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextToolbar;