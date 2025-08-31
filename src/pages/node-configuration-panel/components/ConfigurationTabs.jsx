// src/pages/node-configuration-panel/components/ConfigurationTabs.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const ConfigurationTabs = ({ tabs, activeTab, onTabChange, errors }) => {
  const getTabErrors = (tabId) => {
    return Object.keys(errors).filter(key => key.startsWith(`${tabId}.`));
  };

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-heading-medium text-text-secondary uppercase tracking-wide mb-4">
        Configuration
      </h3>
      
      {tabs.map((tab) => {
        const tabErrors = getTabErrors(tab.id);
        const hasErrors = tabErrors.length > 0;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
              transition-all duration-200 group relative
              ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
              }
            `}
          >
            <Icon 
              name={tab.icon} 
              size={18} 
              className={activeTab === tab.id ? 'text-white' : 'text-text-tertiary'}
            />
            
            <span className="font-body-medium flex-1">
              {tab.label}
            </span>
            
            {/* Error Indicator */}
            {hasErrors && (
              <div className="w-2 h-2 bg-error rounded-full" title={`${tabErrors.length} error(s)`} />
            )}
            
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ConfigurationTabs;