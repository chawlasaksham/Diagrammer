import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const TemplateCard = ({ template, onTemplateClick, onUseTemplate, getComplexityColor }) => {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-elevation transition-micro hover-scale">
      {/* Template Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={template.image}
          alt={template.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-body-medium rounded-full bg-surface ${getComplexityColor(template.complexity)}`}>
            {template.complexity}
          </span>
        </div>
        {template.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-body-medium bg-accent text-white rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-heading-medium text-text-primary mb-2 line-clamp-2">
            {template.title}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-3">
            {template.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-secondary-100 text-text-secondary rounded-md"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-secondary-100 text-text-secondary rounded-md">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-text-tertiary">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Icon name="Download" size={14} />
              <span>{template.usageCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-warning" />
              <span>{template.rating}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{template.estimatedTime}</span>
          </div>
        </div>

        {/* Integrations */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Zap" size={14} className="text-text-tertiary" />
            <span className="text-xs text-text-tertiary">Integrations:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {template.integrations.slice(0, 3).map((integration, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-primary-50 text-primary rounded-md"
              >
                {integration}
              </span>
            ))}
            {template.integrations.length > 3 && (
              <span className="px-2 py-1 text-xs bg-primary-50 text-primary rounded-md">
                +{template.integrations.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onTemplateClick(template)}
            className="flex-1 px-3 py-2 text-sm bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-micro"
          >
            Preview
          </button>
          <button
            onClick={() => onUseTemplate(template)}
            className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 transition-micro"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;