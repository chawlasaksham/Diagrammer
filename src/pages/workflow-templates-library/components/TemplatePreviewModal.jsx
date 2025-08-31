import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const TemplatePreviewModal = ({ template, isOpen, onClose, onUseTemplate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-heading-semibold text-text-primary">
              {template.title}
            </h2>
            <span className={`px-2 py-1 text-xs font-body-medium rounded-full ${
              template.complexity === 'beginner' ? 'bg-success-50 text-success' :
              template.complexity === 'intermediate'? 'bg-warning-50 text-warning' : 'bg-error-50 text-error'
            }`}>
              {template.complexity}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary transition-micro rounded-lg hover:bg-secondary-50"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Template Image and Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Author:</span>
                    <span className="text-sm text-text-primary">{template.author}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Setup Time:</span>
                    <span className="text-sm text-text-primary">{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Usage Count:</span>
                    <span className="text-sm text-text-primary">{template.usageCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-warning" />
                      <span className="text-sm text-text-primary">{template.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-heading-medium text-text-primary mb-3">
                  Description
                </h3>
                <p className="text-text-secondary mb-4">
                  {template.description}
                </p>

                {/* Workflow Overview */}
                <div className="bg-secondary-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-heading-medium text-text-primary mb-3">
                    Workflow Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Circle" size={12} className="text-primary" />
                      <span className="text-text-tertiary">Nodes:</span>
                      <span className="text-text-primary">{template.workflow.nodes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="ArrowRight" size={12} className="text-accent" />
                      <span className="text-text-tertiary">Connections:</span>
                      <span className="text-text-primary">{template.workflow.connections}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <h4 className="text-sm font-heading-medium text-text-primary mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-secondary-100 text-text-secondary rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Required Integrations */}
            <div className="mb-6">
              <h3 className="text-lg font-heading-medium text-text-primary mb-3">
                Required Integrations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {template.integrations.map((integration, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-primary-50 rounded-lg"
                  >
                    <Icon name="Zap" size={16} className="text-primary" />
                    <span className="text-sm text-primary font-body-medium">
                      {integration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Details */}
            <div className="mb-6">
              <h3 className="text-lg font-heading-medium text-text-primary mb-3">
                Workflow Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h4 className="text-sm font-heading-medium text-text-primary mb-2 flex items-center space-x-2">
                    <Icon name="Play" size={16} className="text-success" />
                    <span>Triggers</span>
                  </h4>
                  <ul className="space-y-1">
                    {template.workflow.triggers.map((trigger, index) => (
                      <li key={index} className="text-sm text-text-secondary">
                        • {trigger}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h4 className="text-sm font-heading-medium text-text-primary mb-2 flex items-center space-x-2">
                    <Icon name="Settings" size={16} className="text-accent" />
                    <span>Actions</span>
                  </h4>
                  <ul className="space-y-1">
                    {template.workflow.actions.map((action, index) => (
                      <li key={index} className="text-sm text-text-secondary">
                        • {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* User Reviews */}
            <div className="mb-6">
              <h3 className="text-lg font-heading-medium text-text-primary mb-3">
                User Reviews
              </h3>
              <div className="space-y-3">
                {template.reviews.map((review, index) => (
                  <div key={index} className="bg-secondary-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-body-medium text-text-primary">
                        {review.user}
                      </span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={12}
                            className={i < review.rating ? 'text-warning' : 'text-secondary-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-secondary-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-micro"
          >
            Close
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary-100 text-text-primary rounded-lg hover:bg-secondary-200 transition-micro"
            >
              Save for Later
            </button>
            <button
              onClick={() => onUseTemplate(template)}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-micro"
            >
              <Icon name="Download" size={16} />
              <span>Use This Template</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;