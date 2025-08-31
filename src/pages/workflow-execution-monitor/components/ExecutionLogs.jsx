import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExecutionLogs = ({ logs, selectedNode }) => {
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleLogExpansion = (logId) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getLogLevelConfig = (level) => {
    const configs = {
      info: {
        icon: 'Info',
        color: 'text-accent',
        bg: 'bg-accent-50',
        border: 'border-accent-200'
      },
      success: {
        icon: 'CheckCircle2',
        color: 'text-success',
        bg: 'bg-success-50',
        border: 'border-success-200'
      },
      warning: {
        icon: 'AlertTriangle',
        color: 'text-warning',
        bg: 'bg-warning-50',
        border: 'border-warning-200'
      },
      error: {
        icon: 'XCircle',
        color: 'text-error',
        bg: 'bg-error-50',
        border: 'border-error-200'
      }
    };
    return configs[level] || configs.info;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.nodeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNode = !selectedNode || log.nodeId === selectedNode;
    
    return matchesSearch && matchesNode;
  });

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" 
          />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-secondary-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text-secondary">
            <div className="text-center">
              <Icon name="FileText" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No logs found</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredLogs.map((log) => {
              const config = getLogLevelConfig(log.level);
              const isExpanded = expandedLogs.has(log.id);

              return (
                <div
                  key={log.id}
                  className={`
                    border rounded-lg transition-micro hover:shadow-subtle
                    ${config.border} ${config.bg}
                  `}
                >
                  {/* Log Header */}
                  <div
                    className="p-3 cursor-pointer"
                    onClick={() => toggleLogExpansion(log.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Level Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon 
                          name={config.icon} 
                          size={16} 
                          className={config.color} 
                        />
                      </div>

                      {/* Log Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-body-medium text-text-secondary">
                              {formatTimestamp(log.timestamp)}
                            </span>
                            <span className="text-xs text-text-tertiary">•</span>
                            <span className="text-xs text-text-secondary">
                              {log.nodeName}
                            </span>
                          </div>
                          <Icon 
                            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                            size={14} 
                            className="text-text-tertiary" 
                          />
                        </div>
                        <p className="text-sm text-text-primary">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-current border-opacity-20">
                      {/* Detailed Message */}
                      {log.details && (
                        <div className="mt-3">
                          <h5 className="text-xs font-body-semibold text-text-secondary mb-2">
                            Details
                          </h5>
                          <div className="bg-surface rounded p-3 text-xs text-text-primary whitespace-pre-wrap">
                            {log.details}
                          </div>
                        </div>
                      )}

                      {/* Data Payload */}
                      {log.data && (
                        <div className="mt-3">
                          <h5 className="text-xs font-body-semibold text-text-secondary mb-2">
                            Data
                          </h5>
                          <div className="bg-surface rounded p-3">
                            <pre className="text-xs text-text-primary overflow-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Stack Trace */}
                      {log.stackTrace && (
                        <div className="mt-3">
                          <h5 className="text-xs font-body-semibold text-text-secondary mb-2">
                            Stack Trace
                          </h5>
                          <div className="bg-surface rounded p-3">
                            <pre className="text-xs text-error font-mono overflow-auto">
                              {log.stackTrace}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-3 flex items-center space-x-2">
                        <button className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-micro">
                          <Icon name="Copy" size={12} />
                          <span>Copy</span>
                        </button>
                        <button className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-micro">
                          <Icon name="ExternalLink" size={12} />
                          <span>View Node</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log Stats */}
      <div className="border-t border-border p-3 bg-secondary-50">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{filteredLogs.length} log entries</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-error rounded-full" />
              <span>{filteredLogs.filter(l => l.level === 'error').length} errors</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span>{filteredLogs.filter(l => l.level === 'warning').length} warnings</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionLogs;