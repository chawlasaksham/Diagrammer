import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationStateIndicator = ({ 
  workflowStatus = 'idle',
  hasUnsavedChanges = false,
  connectionStatus = 'connected',
  executionCount = 0 
}) => {
  const location = useLocation();

  const getWorkflowStatusConfig = () => {
    const statusConfig = {
      idle: { 
        icon: 'Circle', 
        color: 'text-text-tertiary', 
        bg: 'bg-secondary-100',
        label: 'Idle'
      },
      running: { 
        icon: 'Play', 
        color: 'text-success', 
        bg: 'bg-success-50',
        label: 'Running',
        pulse: true
      },
      paused: { 
        icon: 'Pause', 
        color: 'text-warning', 
        bg: 'bg-warning-50',
        label: 'Paused'
      },
      error: { 
        icon: 'AlertTriangle', 
        color: 'text-error', 
        bg: 'bg-error-50',
        label: 'Error'
      },
      completed: { 
        icon: 'CheckCircle2', 
        color: 'text-success', 
        bg: 'bg-success-50',
        label: 'Completed'
      }
    };
    return statusConfig[workflowStatus] || statusConfig.idle;
  };

  const getConnectionStatusConfig = () => {
    const statusConfig = {
      connected: { 
        icon: 'Wifi', 
        color: 'text-success',
        label: 'Connected'
      },
      disconnected: { 
        icon: 'WifiOff', 
        color: 'text-error',
        label: 'Disconnected'
      },
      connecting: { 
        icon: 'Loader2', 
        color: 'text-warning',
        label: 'Connecting',
        spin: true
      }
    };
    return statusConfig[connectionStatus] || statusConfig.connected;
  };

  const shouldShowIndicators = () => {
    const showOnPaths = [
      '/visual-workflow-editor',
      '/node-configuration-panel',
      '/workflow-execution-monitor'
    ];
    return showOnPaths.some(path => location.pathname.startsWith(path));
  };

  if (!shouldShowIndicators()) return null;

  const workflowConfig = getWorkflowStatusConfig();
  const connectionConfig = getConnectionStatusConfig();

  return (
    <div className="flex items-center space-x-4">
      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="flex items-center space-x-1.5 px-2 py-1 bg-warning-50 rounded-lg">
          <Icon 
            name="AlertCircle" 
            size={14} 
            className="text-warning" 
          />
          <span className="text-xs font-body-medium text-warning">
            Unsaved
          </span>
        </div>
      )}

      {/* Workflow Status Indicator */}
      <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg ${workflowConfig.bg}`}>
        <Icon 
          name={workflowConfig.icon} 
          size={14} 
          className={`${workflowConfig.color} ${workflowConfig.pulse ? 'pulse-subtle' : ''}`} 
        />
        <span className={`text-xs font-body-medium ${workflowConfig.color}`}>
          {workflowConfig.label}
        </span>
      </div>

      {/* Execution Count (for Monitor page) */}
      {location.pathname === '/workflow-execution-monitor' && executionCount > 0 && (
        <div className="flex items-center space-x-1.5 px-2 py-1 bg-accent-50 rounded-lg">
          <Icon 
            name="Activity" 
            size={14} 
            className="text-accent" 
          />
          <span className="text-xs font-body-medium text-accent">
            {executionCount} runs
          </span>
        </div>
      )}

      {/* Connection Status Indicator */}
      <div className="flex items-center space-x-1.5">
        <Icon 
          name={connectionConfig.icon} 
          size={14} 
          className={`${connectionConfig.color} ${connectionConfig.spin ? 'animate-spin' : ''}`} 
        />
        <span className={`text-xs font-body-medium ${connectionConfig.color} sr-only lg:not-sr-only`}>
          {connectionConfig.label}
        </span>
      </div>

      {/* Responsive Separator */}
      <div className="hidden lg:block w-px h-4 bg-border" />
    </div>
  );
};

export default NavigationStateIndicator;