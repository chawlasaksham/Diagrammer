import React from 'react';
import Icon from 'components/AppIcon';

const RecentActivity = ({ isExpanded, onToggleExpanded }) => {
  const activities = [
    {
      id: 1,
      type: 'execution',
      title: 'Customer Onboarding completed',
      description: 'Workflow executed successfully for user john.doe@email.com',
      timestamp: new Date(Date.now() - 300000),
      status: 'success',
      workflowName: 'Customer Onboarding'
    },
    {
      id: 2,
      type: 'error',
      title: 'Invoice Processing failed',
      description: 'API connection timeout in step 3',
      timestamp: new Date(Date.now() - 900000),
      status: 'error',
      workflowName: 'Invoice Processing'
    },
    {
      id: 3,
      type: 'creation',
      title: 'New workflow created',
      description: 'Lead Qualification workflow created by Emily Chen',
      timestamp: new Date(Date.now() - 1800000),
      status: 'info',
      workflowName: 'Lead Qualification'
    },
    {
      id: 4,
      type: 'execution',
      title: 'Social Media Scheduler completed',
      description: 'Posted to 3 platforms successfully',
      timestamp: new Date(Date.now() - 3600000),
      status: 'success',
      workflowName: 'Social Media Scheduler'
    },
    {
      id: 5,
      type: 'modification',
      title: 'Inventory Sync updated',
      description: 'Configuration changed by David Brown',
      timestamp: new Date(Date.now() - 7200000),
      status: 'info',
      workflowName: 'Inventory Sync'
    },
    {
      id: 6,
      type: 'execution',
      title: 'Support Ticket Routing paused',
      description: 'Workflow paused due to maintenance',
      timestamp: new Date(Date.now() - 10800000),
      status: 'warning',
      workflowName: 'Support Ticket Routing'
    }
  ];

  const getActivityIcon = (type, status) => {
    const iconMap = {
      execution: status === 'success' ? 'CheckCircle2' : status === 'error' ? 'XCircle' : 'Play',
      error: 'AlertTriangle',
      creation: 'Plus',
      modification: 'Edit2'
    };
    return iconMap[type] || 'Activity';
  };

  const getActivityColor = (status) => {
    const colorMap = {
      success: 'text-success',
      error: 'text-error',
      warning: 'text-warning',
      info: 'text-accent'
    };
    return colorMap[status] || 'text-text-tertiary';
  };

  const getActivityBg = (status) => {
    const bgMap = {
      success: 'bg-success-50',
      error: 'bg-error-50',
      warning: 'bg-warning-50',
      info: 'bg-accent-50'
    };
    return bgMap[status] || 'bg-secondary-100';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffInMinutes = (now - timestamp) / (1000 * 60);
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const displayedActivities = isExpanded ? activities : activities.slice(0, 5);

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={18} className="text-text-secondary" />
          <h3 className="text-lg font-heading-medium text-text-primary">
            Recent Activity
          </h3>
        </div>
        
        <button
          onClick={() => onToggleExpanded(!isExpanded)}
          className="p-1 text-text-tertiary hover:text-text-primary transition-micro rounded"
        >
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
          />
        </button>
      </div>

      {/* Activity List */}
      <div className="max-h-96 overflow-y-auto">
        {displayedActivities.length > 0 ? (
          <div className="divide-y divide-border">
            {displayedActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-secondary-50 transition-micro">
                <div className="flex items-start space-x-3">
                  {/* Activity Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityBg(activity.status)}`}>
                    <Icon 
                      name={getActivityIcon(activity.type, activity.status)} 
                      size={14} 
                      className={getActivityColor(activity.status)} 
                    />
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-body-medium text-text-primary mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-accent font-body-medium">
                        {activity.workflowName}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-secondary-100 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-text-tertiary" />
            </div>
            <p className="text-sm text-text-secondary">
              No recent activity
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {activities.length > 5 && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => onToggleExpanded(!isExpanded)}
            className="w-full text-sm text-accent hover:text-accent-600 transition-micro font-body-medium"
          >
            {isExpanded ? 'Show Less' : `View All ${activities.length} Activities`}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;