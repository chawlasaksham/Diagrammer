import React from 'react';
import Icon from 'components/AppIcon';

const MetricsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className = '',
  description 
}) => {
  return (
    <div className={`bg-surface border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-current" />
          </div>
          <div>
            <h3 className="text-sm font-body-medium text-text-secondary">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-text-tertiary mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-xs font-body-medium ${
            trend.isPositive ? 'text-success' : 'text-error'
          }`}>
            <Icon 
              name={trend.isPositive ? 'TrendingUp' : 'TrendingDown'} 
              size={14} 
            />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      
      <div className="text-2xl font-heading-bold text-text-primary">
        {value}
      </div>
      
      {trend && (
        <p className="text-xs text-text-tertiary mt-2">
          {trend.isPositive ? 'Increase' : 'Decrease'} from last period
        </p>
      )}
    </div>
  );
};

export default MetricsCard;