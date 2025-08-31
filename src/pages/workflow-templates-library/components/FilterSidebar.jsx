import React from 'react';
import Icon from 'components/AppIcon';

const FilterSidebar = ({
  categories,
  complexityLevels,
  selectedCategory,
  selectedComplexity,
  onCategoryChange,
  onComplexityChange
}) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-lg font-heading-medium text-text-primary mb-4">
        Filters
      </h3>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-heading-medium text-text-primary mb-3">
          Categories
        </h4>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-micro ${
                selectedCategory === category.id
                  ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon 
                  name={category.icon} 
                  size={16} 
                  className={selectedCategory === category.id ? 'text-primary' : 'text-current'} 
                />
                <span className="text-sm">{category.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-primary-100 text-primary' :'bg-secondary-100 text-text-tertiary'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Complexity Levels */}
      <div className="mb-6">
        <h4 className="text-sm font-heading-medium text-text-primary mb-3">
          Complexity Level
        </h4>
        <div className="space-y-2">
          {complexityLevels.map(level => (
            <button
              key={level.id}
              onClick={() => onComplexityChange(level.id)}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-micro ${
                selectedComplexity === level.id
                  ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                level.id === 'beginner' ? 'bg-success' :
                level.id === 'intermediate' ? 'bg-warning' :
                level.id === 'advanced'? 'bg-error' : 'bg-secondary-300'
              }`} />
              <span className="text-sm">{level.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-secondary-50 rounded-lg p-3">
        <h4 className="text-sm font-heading-medium text-text-primary mb-2">
          Quick Stats
        </h4>
        <div className="space-y-2 text-xs text-text-secondary">
          <div className="flex items-center justify-between">
            <span>Total Templates:</span>
            <span className="font-body-medium">24</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Featured:</span>
            <span className="font-body-medium">6</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Most Popular:</span>
            <span className="font-body-medium">Social Media</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;