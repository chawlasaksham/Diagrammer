// src/pages/node-configuration-panel/components/ActionBar.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const ActionBar = ({ 
  onCancel, 
  onTest, 
  onSave, 
  isTestingConnection, 
  isSaving, 
  hasErrors 
}) => {
  return (
    <div className="bg-surface border-t border-border p-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Status */}
        <div className="flex items-center space-x-4">
          {hasErrors && (
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm font-body-medium">
                Configuration has errors
              </span>
            </div>
          )}
          
          {!hasErrors && (
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle2" size={16} />
              <span className="text-sm font-body-medium">
                Configuration is valid
              </span>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-body-medium text-text-secondary border border-border rounded-lg hover:bg-secondary-50 hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          {/* Test Configuration Button */}
          <button
            onClick={onTest}
            disabled={hasErrors || isTestingConnection || isSaving}
            className={`
              flex items-center space-x-2 px-4 py-2 text-sm font-body-medium rounded-lg transition-colors
              ${
                hasErrors || isTestingConnection || isSaving
                  ? 'bg-secondary-200 text-text-tertiary cursor-not-allowed' :'bg-accent text-white hover:bg-accent-600'
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
                <span>Test Configuration</span>
              </>
            )}
          </button>
          
          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={hasErrors || isSaving || isTestingConnection}
            className={`
              flex items-center space-x-2 px-6 py-2 text-sm font-body-medium rounded-lg transition-colors
              ${
                hasErrors || isSaving || isTestingConnection
                  ? 'bg-secondary-200 text-text-tertiary cursor-not-allowed' :'bg-primary text-white hover:bg-primary-700'
              }
            `}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Icon name="Save" size={16} />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden mt-4 space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 px-4 py-3 text-sm font-body-medium text-text-secondary border border-border rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={onTest}
            disabled={hasErrors || isTestingConnection || isSaving}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-body-medium rounded-lg transition-colors
              ${
                hasErrors || isTestingConnection || isSaving
                  ? 'bg-secondary-200 text-text-tertiary' :'bg-accent text-white'
              }
            `}
          >
            {isTestingConnection ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon name="Play" size={16} />
            )}
            <span>Test</span>
          </button>
        </div>
        
        <button
          onClick={onSave}
          disabled={hasErrors || isSaving || isTestingConnection}
          className={`
            w-full flex items-center justify-center space-x-2 px-6 py-3 text-sm font-body-medium rounded-lg transition-colors
            ${
              hasErrors || isSaving || isTestingConnection
                ? 'bg-secondary-200 text-text-tertiary' :'bg-primary text-white'
            }
          `}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Configuration...</span>
            </>
          ) : (
            <>
              <Icon name="Save" size={16} />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionBar;