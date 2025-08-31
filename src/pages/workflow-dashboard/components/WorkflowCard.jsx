import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const WorkflowCard = ({ workflow, onAction }) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        color: 'text-success',
        bg: 'bg-success-50',
        icon: 'Play',
        label: 'Active'
      },
      draft: {
        color: 'text-text-tertiary',
        bg: 'bg-secondary-100',
        icon: 'FileText',
        label: 'Draft'
      },
      error: {
        color: 'text-error',
        bg: 'bg-error-50',
        icon: 'AlertTriangle',
        label: 'Error'
      },
      paused: {
        color: 'text-warning',
        bg: 'bg-warning-50',
        icon: 'Pause',
        label: 'Paused'
      }
    };
    return configs[status] || configs.draft;
  };

  const statusConfig = getStatusConfig(workflow.status);

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    if (action === 'delete') {
      setShowDeleteConfirm(true);
    } else {
      onAction(action, workflow.id);
    }
    setShowActions(false);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    onAction('delete', workflow.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative bg-surface border border-border rounded-lg p-6 hover:shadow-elevation transition-micro hover-scale group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-heading-medium text-text-primary mb-1 truncate">
            {workflow.name}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2">
            {workflow.description}
          </p>
        </div>
        
        {/* Actions Menu */}
        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-1 text-text-tertiary hover:text-text-primary transition-micro rounded opacity-0 group-hover:opacity-100"
          >
            <Icon name="MoreVertical" size={16} />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-8 w-48 bg-surface border border-border rounded-lg shadow-modal z-10">
              <div className="py-1">
                <button
                  onClick={(e) => handleAction('edit', e)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-micro"
                >
                  <Icon name="Edit2" size={16} />
                  <span>Edit Workflow</span>
                </button>
                <button
                  onClick={(e) => handleAction('run', e)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-micro"
                  disabled={workflow.status === 'draft'}
                >
                  <Icon name="Play" size={16} />
                  <span>Run Workflow</span>
                </button>
                <button
                  onClick={(e) => handleAction('duplicate', e)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-secondary-50 transition-micro"
                >
                  <Icon name="Copy" size={16} />
                  <span>Duplicate</span>
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={(e) => handleAction('delete', e)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error-50 transition-micro"
                >
                  <Icon name="Trash2" size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status and Metrics */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg ${statusConfig.bg}`}>
          <Icon name={statusConfig.icon} size={14} className={statusConfig.color} />
          <span className={`text-xs font-body-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-text-tertiary">
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={12} />
            <span>{workflow.nodes} nodes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Activity" size={12} />
            <span>{workflow.executions}</span>
          </div>
        </div>
      </div>

      {/* Success Rate Bar */}
      {workflow.executions > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-text-tertiary mb-1">
            <span>Success Rate</span>
            <span>{workflow.successRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                workflow.successRate >= 95 ? 'bg-success' :
                workflow.successRate >= 80 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${workflow.successRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {workflow.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-accent-50 text-accent rounded-md"
          >
            {tag}
          </span>
        ))}
        {workflow.tags.length > 3 && (
          <span className="px-2 py-1 text-xs bg-secondary-100 text-text-tertiary rounded-md">
            +{workflow.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>Modified {formatDate(workflow.lastModified)}</span>
        <span>by {workflow.createdBy}</span>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-micro">
        <button
          onClick={(e) => handleAction('run', e)}
          disabled={workflow.status === 'draft'}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs bg-success-50 text-success rounded-md hover:bg-success-100 transition-micro disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="Play" size={12} />
          <span>Run</span>
        </button>
        <button
          onClick={(e) => handleAction('edit', e)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs bg-primary-50 text-primary rounded-md hover:bg-primary-100 transition-micro"
        >
          <Icon name="Edit2" size={12} />
          <span>Edit</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error-50 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-heading-medium text-text-primary">
                  Delete Workflow
                </h3>
                <p className="text-sm text-text-secondary">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to delete "{workflow.name}"?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 text-sm bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-micro"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-sm bg-error text-white rounded-lg hover:bg-error-500 transition-micro"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click overlay to close dropdowns */}
      {(showActions || showDeleteConfirm) && (
        <div
          className="fixed inset-0 z-0"
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(false);
            setShowDeleteConfirm(false);
          }}
        />
      )}
    </div>
  );
};

export default WorkflowCard;